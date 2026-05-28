from setuptools import find_packages, setup


setup(
    name="techdocs-git-audit-plugin",
    version="0.1.0",
    description="MkDocs plugin that renders creator and last updater git audit details for TechDocs pages.",
    packages=find_packages(),
    install_requires=["mkdocs>=1.0"],
    entry_points={
        "mkdocs.plugins": [
            "techdocs-git-audit = techdocs_git_audit.plugin:TechDocsGitAuditPlugin",
        ],
    },
)
