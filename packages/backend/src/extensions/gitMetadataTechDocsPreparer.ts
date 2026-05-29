import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { Entity, getEntitySourceLocation } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotModifiedError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import {
  DirectoryPreparer,
  parseReferenceAnnotation,
  PreparerBase,
  PreparerOptions,
  PreparerResponse,
  techdocsPreparerExtensionPoint,
  transformDirLocation,
  UrlPreparer,
} from '@backstage/plugin-techdocs-node';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import { execFile } from 'child_process';
import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

type GithubTarget = {
  cloneUrl: string;
  host: string;
  owner: string;
  repo: string;
  branch: string;
  projectPath: string;
};

abstract class BaseGitMetadataTechDocsPreparer implements PreparerBase {
  private readonly fallback: PreparerBase;
  private readonly config: Config;

  constructor(options: { fallback: PreparerBase; config: Config }) {
    this.fallback = options.fallback;
    this.config = options.config;
  }

  shouldCleanPreparedDirectory() {
    return true;
  }

  async prepare(
    entity: Entity,
    options?: PreparerOptions,
  ): Promise<PreparerResponse> {
    const target = this.getTarget(entity);
    const githubTarget = await this.parseGithubTarget(target);

    if (!githubTarget) {
      return this.fallback.prepare(entity, options);
    }

    options?.logger?.debug(
      `Cloning TechDocs source from ${githubTarget.owner}/${githubTarget.repo}#${githubTarget.branch}`,
    );

    const latestCommit = await this.getLatestCommit(githubTarget);
    if (options?.etag && latestCommit === options.etag) {
      throw new NotModifiedError();
    }

    const preparedDir = await this.cloneAndPrepare(githubTarget);

    return {
      preparedDir,
      etag: latestCommit,
    };
  }

  protected abstract getTarget(entity: Entity): string;

  private async parseGithubTarget(
    target: string,
  ): Promise<GithubTarget | undefined> {
    let url: URL;
    try {
      url = new URL(target);
    } catch {
      return undefined;
    }

    if (url.hostname !== 'github.com') {
      return undefined;
    }

    const segments = url.pathname.split('/').filter(Boolean);
    const [owner, repoName, marker, ...refAndPath] = segments;

    if (!owner || !repoName || !['tree', 'blob'].includes(marker)) {
      return undefined;
    }

    const repo = repoName.replace(/\.git$/, '');
    const cloneUrl = `https://${url.hostname}/${owner}/${repo}.git`;
    const refs = await this.listRemoteBranches(cloneUrl, url.hostname);
    const branch = this.findBranch(refAndPath, refs);

    if (!branch) {
      return undefined;
    }

    return {
      cloneUrl,
      host: url.hostname,
      owner,
      repo,
      branch,
      projectPath: refAndPath.slice(branch.split('/').length).join('/'),
    };
  }

  private async listRemoteBranches(cloneUrl: string, host: string) {
    const { stdout } = await execFileAsync(
      'git',
      ['ls-remote', '--heads', cloneUrl],
      { env: await this.gitEnv(host) },
    );

    return stdout
      .split('\n')
      .map(line => line.match(/refs\/heads\/(.+)$/)?.[1])
      .filter((branch): branch is string => Boolean(branch));
  }

  private findBranch(refAndPath: string[], branches: string[]) {
    const target = refAndPath.join('/');

    return branches
      .filter(branch => target === branch || target.startsWith(`${branch}/`))
      .sort((a, b) => b.length - a.length)[0];
  }

  private async getLatestCommit(target: GithubTarget) {
    const { stdout } = await execFileAsync(
      'git',
      ['ls-remote', target.cloneUrl, `refs/heads/${target.branch}`],
      { env: await this.gitEnv(target.host) },
    );

    return stdout.split(/\s+/)[0];
  }

  private async cloneAndPrepare(target: GithubTarget) {
    const cloneRoot = await mkdtemp(
      path.join(os.tmpdir(), 'backstage-techdocs-git-'),
    );

    try {
      await execFileAsync(
        'git',
        [
          'clone',
          '--branch',
          target.branch,
          '--single-branch',
          target.cloneUrl,
          cloneRoot,
        ],
        { env: await this.gitEnv(target.host) },
      );

      if (target.projectPath) {
        await this.writeInheritedMkdocsConfig(cloneRoot, target.projectPath);
      }

      this.scheduleCleanup(cloneRoot);

      return cloneRoot;
    } catch (error) {
      await rm(cloneRoot, { force: true, recursive: true });
      throw error;
    }
  }

  private scheduleCleanup(cloneRoot: string) {
    const timeout = setTimeout(() => {
      rm(cloneRoot, { force: true, recursive: true }).catch(() => {});
    }, 60 * 60 * 1000);

    timeout.unref();
  }

  private async writeInheritedMkdocsConfig(
    cloneRoot: string,
    projectPath: string,
  ) {
    const normalizedProjectPath = projectPath.replace(/^\/+|\/+$/g, '');
    const mkdocsConfigPath = path.join(
      cloneRoot,
      normalizedProjectPath,
      'mkdocs.yml',
    );
    const docsDir = await this.readDocsDir(mkdocsConfigPath);
    const projectDocsDir = path.posix.join(normalizedProjectPath, docsDir);

    await writeFile(
      path.join(cloneRoot, 'mkdocs.yml'),
      [
        `INHERIT: ${JSON.stringify(`${normalizedProjectPath}/mkdocs.yml`)}`,
        `docs_dir: ${JSON.stringify(projectDocsDir)}`,
        '',
      ].join('\n'),
      'utf8',
    );
  }

  private async readDocsDir(mkdocsConfigPath: string) {
    const config = await readFile(mkdocsConfigPath, 'utf8');
    const docsDir = config.match(/^docs_dir:\s*['"]?([^'"\n#]+)['"]?/m)?.[1];

    return docsDir?.trim() || 'docs';
  }

  private async gitEnv(host: string) {
    const token = this.githubToken(host);

    if (!token) {
      return { ...process.env, GIT_TERMINAL_PROMPT: '0' };
    }

    const encodedToken = Buffer.from(`x-access-token:${token}`).toString(
      'base64',
    );

    return {
      ...process.env,
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: `http.https://${host}/.extraheader`,
      GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${encodedToken}`,
      GIT_TERMINAL_PROMPT: '0',
    };
  }

  private githubToken(host: string) {
    return this.config
      .getOptionalConfigArray('integrations.github')
      ?.find(integration => integration.getString('host') === host)
      ?.getOptionalString('token');
  }
}

class GitMetadataUrlPreparer extends BaseGitMetadataTechDocsPreparer {
  protected getTarget(entity: Entity) {
    return parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity).target;
  }
}

class GitMetadataRemoteDirPreparer extends BaseGitMetadataTechDocsPreparer {
  private readonly scmIntegrations: ScmIntegrations;

  constructor(options: { fallback: PreparerBase; config: Config }) {
    super(options);
    this.scmIntegrations = ScmIntegrations.fromConfig(options.config);
  }

  shouldCleanPreparedDirectory() {
    return false;
  }

  async prepare(
    entity: Entity,
    options?: PreparerOptions,
  ): Promise<PreparerResponse> {
    if (getEntitySourceLocation(entity).type === 'file') {
      return this.prepareLocalDirectory(entity);
    }

    return super.prepare(entity, options);
  }

  protected getTarget(entity: Entity) {
    const sourceLocation = getEntitySourceLocation(entity);

    if (sourceLocation.type !== 'url') {
      throw new Error('Only URL-backed dir TechDocs sources can be cloned');
    }

    const annotation = parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity);

    return this.scmIntegrations.resolveUrl({
      base: sourceLocation.target,
      url: annotation.target,
    });
  }

  private async prepareLocalDirectory(
    entity: Entity,
  ): Promise<PreparerResponse> {
    const annotation = parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity);
    const transformed = transformDirLocation(
      entity,
      annotation,
      this.scmIntegrations,
    );

    if (transformed.type !== 'dir') {
      throw new Error('Expected file-backed TechDocs source to resolve to dir');
    }

    return {
      preparedDir: transformed.target,
      etag: '',
    };
  }
}

const gitMetadataTechDocsPreparer = createBackendModule({
  pluginId: 'techdocs',
  moduleId: 'git-metadata-preparer',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        urlReader: coreServices.urlReader,
        preparer: techdocsPreparerExtensionPoint,
      },
      async init({ config, logger, urlReader, preparer }) {
        if (
          !config.getOptionalBoolean('techdocs.gitMetadataPreparer.enabled')
        ) {
          return;
        }

        const urlFallback = UrlPreparer.fromConfig({
          logger,
          reader: urlReader,
        });
        const dirFallback = DirectoryPreparer.fromConfig(config, {
          logger,
          reader: urlReader,
        });

        preparer.registerPreparer(
          'url',
          new GitMetadataUrlPreparer({
            fallback: urlFallback,
            config,
          }),
        );
        preparer.registerPreparer(
          'dir',
          new GitMetadataRemoteDirPreparer({
            fallback: dirFallback,
            config,
          }),
        );
      },
    });
  },
});

export default gitMetadataTechDocsPreparer;
