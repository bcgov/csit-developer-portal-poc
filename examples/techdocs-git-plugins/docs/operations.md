# Operations

This page gives the plugins a second Markdown file to inspect. That makes it easier to confirm that each TechDocs page can show its own git revision date and authors.

## Local build notes

From the project root, install the Python dependencies and start Backstage:

```bash
yarn techdocs-deps
yarn start
```

The local app configuration registers this component from `examples/techdocs-git-plugins/catalog-info.yaml`.
