import unittest
from datetime import datetime, timezone

from techdocs_git_audit.plugin import CommitInfo, PageAudit, TechDocsGitAuditPlugin


class TechDocsGitAuditPluginTest(unittest.TestCase):
    def setUp(self):
        self.plugin = TechDocsGitAuditPlugin()
        self.plugin.load_config({})

    def test_renders_audit_card(self):
        timestamp = int(datetime(2026, 4, 16, tzinfo=timezone.utc).timestamp())
        audit = PageAudit(
            created=CommitInfo("Tanya Riemann", "tanya@example.com", timestamp),
            updated=CommitInfo("Taylor Reed", "taylor@example.com", timestamp),
            has_uncommitted_changes=False,
        )

        rendered = self.plugin._render_audit(audit)

        self.assertIn(">Created</span>", rendered)
        self.assertIn(">Last updated</span>", rendered)
        self.assertNotIn("<style>", rendered)
        self.assertNotIn("md-source-file", rendered)
        self.assertIn('techdocs-git-audit__avatar" aria-hidden="true">TR</span>', rendered)
        self.assertIn('href="mailto:tanya@example.com">Tanya Riemann</a>', rendered)
        self.assertIn("Apr 16, 2026", rendered)
        self.assertIn("techdocs-git-audit__calendar", rendered)

    def test_escapes_author_and_uses_pending_state(self):
        timestamp = int(datetime(2026, 4, 6, tzinfo=timezone.utc).timestamp())
        audit = PageAudit(
            created=CommitInfo("<Tanya>", "", timestamp),
            updated=None,
            has_uncommitted_changes=True,
        )

        rendered = self.plugin._render_audit(audit)

        self.assertIn("&lt;Tanya&gt;", rendered)
        self.assertNotIn("<Tanya>", rendered)
        self.assertIn("Apr 6, 2026", rendered)
        self.assertIn("Not committed yet", rendered)


if __name__ == "__main__":
    unittest.main()
