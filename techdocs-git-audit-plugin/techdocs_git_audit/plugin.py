from __future__ import annotations

import html
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from mkdocs.config import config_options
from mkdocs.plugins import BasePlugin
from mkdocs.structure.files import Files
from mkdocs.structure.pages import Page


@dataclass
class CommitInfo:
    name: str
    email: str
    timestamp: int


@dataclass
class PageAudit:
    created: CommitInfo
    updated: CommitInfo | None
    has_uncommitted_changes: bool


class TechDocsGitAuditPlugin(BasePlugin):
    config_scheme = (
        ("enabled", config_options.Type(bool, default=True)),
        ("date_format", config_options.Type(str, default="%b %d, %Y")),
        ("timezone", config_options.Type(str, default="UTC")),
        ("show_email_address", config_options.Type(bool, default=True)),
        ("created_label", config_options.Type(str, default="Created")),
        ("updated_label", config_options.Type(str, default="Last updated")),
        ("not_committed_label", config_options.Type(str, default="Not committed yet")),
    )

    def on_page_content(
        self, html_content: str, *, page: Page, config, files: Files, **kwargs
    ) -> str:
        if not self.config["enabled"]:
            return html_content

        path = getattr(page.file, "abs_src_path", None)
        if not path:
            return html_content

        audit = self._audit_for_path(Path(path))
        if audit is None:
            return html_content

        return f"{html_content}\n{self._render_audit(audit)}"

    def _audit_for_path(self, path: Path) -> PageAudit | None:
        root = self._git(path.parent, ["rev-parse", "--show-toplevel"])
        if not root:
            return None

        root_path = Path(root)
        relative_path = path.resolve().relative_to(root_path.resolve())
        log_output = self._git(
            root_path,
            [
                "log",
                "--follow",
                "--format=%an%x1f%ae%x1f%at",
                "--",
                str(relative_path),
            ],
        )
        if not log_output:
            return None

        commits = [self._parse_commit(line) for line in log_output.splitlines()]
        commits = [commit for commit in commits if commit is not None]
        if not commits:
            return None

        return PageAudit(
            created=commits[-1],
            updated=commits[0],
            has_uncommitted_changes=self._has_uncommitted_changes(root_path, relative_path),
        )

    def _parse_commit(self, line: str) -> CommitInfo | None:
        parts = line.split("\x1f")
        if len(parts) != 3:
            return None

        name, email, timestamp = parts
        return CommitInfo(name=name, email=email, timestamp=int(timestamp))

    def _has_uncommitted_changes(self, root_path: Path, relative_path: Path) -> bool:
        status = self._git(
            root_path,
            ["status", "--porcelain", "--", str(relative_path)],
        )

        return bool(status)

    def _git(self, cwd: Path, args: list[str]) -> str:
        try:
            result = subprocess.run(
                ["git", *args],
                cwd=cwd,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            return result.stdout.strip()
        except (subprocess.CalledProcessError, FileNotFoundError):
            return ""

    def _render_audit(self, audit: PageAudit) -> str:
        created = self._render_fact(
            self.config["created_label"],
            audit.created,
            self._format_date(audit.created.timestamp),
        )

        if audit.has_uncommitted_changes:
            updated = self._render_pending_fact()
        elif audit.updated:
            updated = self._render_fact(
                self.config["updated_label"],
                audit.updated,
                self._format_date(audit.updated.timestamp),
            )
        else:
            updated = ""

        return f"""
<aside class="techdocs-git-audit">
  {created}
  {updated}
</aside>
"""

    def _render_fact(self, label: str, commit: CommitInfo, date: str) -> str:
        timestamp = datetime.fromtimestamp(
            commit.timestamp, tz=ZoneInfo(self.config["timezone"])
        ).isoformat()

        return f"""
  <span class="techdocs-git-audit__fact">
    <span class="techdocs-git-audit__label">{html.escape(label)}</span>
    <span class="techdocs-git-audit__avatar" aria-hidden="true">{self._initials(commit.name)}</span>
    {self._render_author(commit)}
    <span class="techdocs-git-audit__divider" aria-hidden="true"></span>
    <time class="techdocs-git-audit__date" datetime="{timestamp}">
      {self._calendar_icon()}
      {html.escape(date)}
    </time>
  </span>
"""

    def _render_pending_fact(self) -> str:
        label = html.escape(self.config["updated_label"])
        pending = html.escape(self.config["not_committed_label"])

        return f"""
  <span class="techdocs-git-audit__fact techdocs-git-audit__fact--pending">
    <span class="techdocs-git-audit__label">{label}</span>
    <span class="techdocs-git-audit__author">{pending}</span>
  </span>
"""

    def _render_author(self, commit: CommitInfo) -> str:
        name = html.escape(commit.name)
        email = html.escape(commit.email)

        if self.config["show_email_address"] and commit.email:
            return f'<a class="techdocs-git-audit__author" href="mailto:{email}">{name}</a>'

        return f'<span class="techdocs-git-audit__author">{name}</span>'

    def _initials(self, name: str) -> str:
        words = name.split()
        initials = "".join(word[0] for word in words[:2] if word)
        return html.escape(initials.upper())

    def _calendar_icon(self) -> str:
        return """
      <svg class="techdocs-git-audit__calendar" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V9h14v11ZM7 11h5v5H7v-5Z"/>
      </svg>"""

    def _format_date(self, timestamp: int) -> str:
        timezone = ZoneInfo(self.config["timezone"])
        date = datetime.fromtimestamp(timestamp, tz=timezone)

        return date.strftime(self.config["date_format"]).replace(" 0", " ")
