# TechDocs git plugins example

This component demonstrates a TechDocs site that enables two MkDocs plugins backed by git metadata:

- `mkdocs-git-revision-date-localized-plugin`
- `mkdocs-git-authors-plugin`

When TechDocs builds this site, the revision date plugin adds the page's last git revision date to the generated documentation. The authors plugin adds the git authors for each page.

## Why this example exists

Use this as a small local reference when testing TechDocs generation, local dependency installation, and plugin rendering in Backstage.

## Configuration

The example configures both plugins in `mkdocs.yml`:

```yaml
plugins:
  - techdocs-core
  - git-revision-date-localized:
      enable_creation_date: true
      type: date
      fallback_to_build_date: true
  - git-authors:
      fallback_to_empty: true
```

Backstage may generate TechDocs from a prepared temporary directory that does not
include `.git` metadata. In that case, `fallback_to_build_date` keeps revision
dates from failing the build, and `fallback_to_empty` keeps the authors plugin
from failing when git history is unavailable.

The component catalog descriptor points TechDocs at this directory with:

```yaml
metadata:
  annotations:
    backstage.io/techdocs-ref: dir:.
```
