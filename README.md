# Developer Portal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Build and update gitops repo](https://github.com/bcgov/csit-developer-portal-poc/actions/workflows/build-update-gitops.yaml/badge.svg)](https://github.com/bcgov/csit-developer-portal-poc/actions/workflows/build-update-gitops.yaml)
[![CodeQL](https://github.com/bcgov/csit-developer-portal-poc/workflows/CodeQL/badge.svg)](https://github.com/bcgov/csit-developer-portal-poc/actions/workflows/github-code-scanning/codeql)
[![Run Unit Tests](https://github.com/bcgov/csit-developer-portal-poc/actions/workflows/test.yaml/badge.svg)](https://github.com/bcgov/csit-developer-portal-poc/actions/workflows/test.yaml)

This is the proof of concept of the Connected Services Integration Toolkit integrated into the [developer portal for the Province of British Columbia](https://developer.gov.bc.ca) built using [Backstage](https://backstage.io).

## Local Development

### Required Tools

- Node [long-term-support version](https://nodejs.dev/en/about/releases/) (i.e. lts/hydrogen)

### Setup

- For development purposes, the in memory SQLite database is sufficient (it is already configured)
  - Alternativley, [Postgres](https://www.postgresql.org) can be configured
    - Install [Postgres locally](https://www.postgresql.org/download/) or via [docker](https://hub.docker.com/_/postgres)
- Create an `app-config.local.yaml` file based off of the [app-config.local.template.yaml](app-config.local.template.yaml) file.

### Running

To run the project, run the following at the project's root directory:

Note: While not required for installing packages, you will still need a `GITHUB_TOKEN` environment variable set at runtime for the portal's GitHub integrations (Catalog, Scaffolder, etc.) to function.

```
yarn install
yarn start
```

### Testing

End to end tests are in the [packages/app/e2e-tests](./packages/app/e2e-tests/) directory.

To run locally:

- start a local instance
- `yarn test:e2e`

To run against a dev instance:

- Set the `PLAYWRIGHT_URL` to your dev instance when running the test
- `PLAYWRIGHT_URL=https://dev.example.org yarn test:e2e`

### Dockerfile

Note: The dockerfile is based on the [Janus showcase project](https://github.com/janus-idp/backstage-showcase/)

Using Docker locally, requires us to set the GITHUB_TOKEN:

```
$ docker buildx build \
  --secret id=GITHUB_TOKEN,env=GITHUB_TOKEN \
  -f packages/backend/Dockerfile \
  .
```

**Note**: You will need to modify ```app-config.production.yaml``` to fit your local environment if you plan to run the docker image locally.

### Deployment

A demonstration deployment is live at https://csit-devhub-apps-gov-bc-ca.dev.api.gov.bc.ca/.

This deployment uses `app-config.demo.yaml` in place of `app-config.production.yaml`.

To update this deployment:

- build a new image by running a workflow dispatch of the [build
  action](https://github.com/bcgov/csit-developer-portal-poc/actions/workflows/build.yaml)
  on the desired branch
- update the version tag in the APS infra repo

<!-- See the [gitops repo](https://github.com/bcgov-c/tenant-gitops-f5ff48). -->

### More information

See the [Backstage.io documentation](https://backstage.io/docs/getting-started/)
