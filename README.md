# Developer Portal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Build and update gitops repo](https://github.com/bcgov/developer-portal/actions/workflows/build-update-gitops.yaml/badge.svg)](https://github.com/bcgov/developer-portal/actions/workflows/build-update-gitops.yaml)
[![CodeQL](https://github.com/bcgov/developer-portal/workflows/CodeQL/badge.svg)](https://github.com/bcgov/developer-portal/actions/workflows/github-code-scanning/codeql)
[![Run Unit Tests](https://github.com/bcgov/developer-portal/actions/workflows/test.yaml/badge.svg)](https://github.com/bcgov/developer-portal/actions/workflows/test.yaml)

This is a proof of concept project for integrating the [developer portal](https://developer.gov.bc.ca) with custom plugin to support Connected Services for the Province of British Columbia.

## Local Development

### Required Tools

- Node [long-term-support version](https://nodejs.dev/en/about/releases/) (i.e. lts/hydrogen)

### Setup

- For development purposes, the in memory SQLite database is sufficient (it is already configured)
  - Alternativley, [Postgres](https://www.postgresql.org) can be configured
    - Install [Postgres locally](https://www.postgresql.org/download/) or via [docker](https://hub.docker.com/_/postgres)
- Create an `app-config.local.yaml` file based off of the [app-config.local.template.yaml](app-config.local.template.yaml) file.
- Create a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
  - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
  - Click "Generate new token (classic)"
  - Give it a descriptive name (e.g., "Backstage Package Access")
  - Select the read:packages scope
  - Give a lifespan of 90 days (or less)
  - **Important**: Authorize the token for SSO with the `bcgov` organization after creating it
  - Copy the token (you won't be able to see it again)
  
### Running

To run the project, use the following at the project's root directory

```
$ export GITHUB_TOKEN=<your_github_token>
$ yarn install
$ yarn start
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

When using the Dockerfile, include `GITHUB_TOKEN` as a build argument:

```
$ docker build --file packages/app/Dockerfile --build-arg GITHUB_TOKEN=<your_github_token> -t developer-portal-poc .
```

### Deployment

See the [gitops repo](https://github.com/bcgov-c/tenant-gitops-f5ff48).

### More information

See the [Backstage.io documentation](https://backstage.io/docs/getting-started/)
