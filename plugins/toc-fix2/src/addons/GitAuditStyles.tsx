import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const STYLE_ID = 'techdocs-git-audit-styles';

const gitAuditCss = `
.techdocs-git-audit {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 40px;
  margin: 32px 0 16px;
}

.techdocs-git-audit__fact {
  align-items: center;
  color: #333;
  display: grid;
  font-size: 14px;
  gap: 6px 8px;
  grid-template-columns: 24px auto 1px auto;
}

.techdocs-git-audit__label {
  color: #777;
  font-size: 11px;
  font-weight: 700;
  grid-column: 1 / -1;
  letter-spacing: .02em;
  line-height: 1;
  text-transform: uppercase;
}

.techdocs-git-audit__avatar {
  align-items: center;
  background: #e1ecf8;
  border-radius: 50%;
  color: #2864a5;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.techdocs-git-audit__author {
  font-weight: 500;
  white-space: nowrap;
}

.techdocs-git-audit a.techdocs-git-audit__author {
  color: #1a5a9e;
}

.techdocs-git-audit__divider {
  align-self: stretch;
  background: #d7d7d7;
  min-height: 18px;
}

.techdocs-git-audit__date {
  align-items: center;
  display: inline-flex;
  gap: 6px;
  white-space: nowrap;
}

.techdocs-git-audit__calendar {
  fill: currentcolor;
  height: 14px;
  width: 14px;
}

.techdocs-git-audit__fact--pending {
  grid-template-columns: auto;
}

@media (max-width: 600px) {
  .techdocs-git-audit {
    gap: 20px;
  }
}
`;

export const GitAuditStylesAddon = () => {
  const auditElements = useShadowRootElements<HTMLElement>([
    '.techdocs-git-audit',
  ]);

  useEffect(() => {
    const roots = new Set<ShadowRoot>();

    auditElements.forEach(element => {
      const root = element.getRootNode();
      if (!(root instanceof ShadowRoot)) {
        return;
      }

      roots.add(root);
      if (root.getElementById(STYLE_ID)) {
        return;
      }

      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = gitAuditCss;
      root.appendChild(style);
    });

    return () => {
      roots.forEach(root => root.getElementById(STYLE_ID)?.remove());
    };
  }, [auditElements]);

  return null;
};
