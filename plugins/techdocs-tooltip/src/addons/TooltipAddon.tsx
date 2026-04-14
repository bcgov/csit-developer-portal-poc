import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

/**
 * Adds styled tooltips to elements with a `title` attribute inside the
 * TechDocs shadow DOM. The MkDocs Material "content.tooltips" feature requires
 * JavaScript that Backstage's DOMPurify sanitizer strips, so this addon
 * reimplements the visual behaviour.
 *
 * Tooltip syntax in your docs markdown (no MkDocs extensions required):
 *
 *   <span title="I'm a tooltip!">Hover me</span>
 *   <abbr title="Hyper Text Markup Language">HTML</abbr>
 *
 * Plain inline HTML works in MkDocs without any extra extensions.
 * The `title` attribute on <span> must be allowed in app-config.yaml:
 *
 *   techdocs.sanitizer.allowedAttributes.span: [class, title]
 */
export const TooltipAddon = () => {
  const titledElements = useShadowRootElements<HTMLElement>([
    'abbr[title]',
    '[title]:not([title=""])',
  ]);

  useEffect(() => {
    if (!titledElements.length) return;

    const rootNode = titledElements[0].getRootNode();
    // If this isn't a ShadowRoot, we can't inject styles where TechDocs renders.
    if (!(rootNode instanceof ShadowRoot)) return;

    const styleId = 'techdocs-tooltip-addon-styles';
    const existing = rootNode.getElementById?.(styleId);
    if (existing) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
abbr[title],
[title]:not([title=""]) {
  position: relative;
  cursor: help;
}

abbr[title]::after,
[title]:not([title=""])::after {
  content: attr(title);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background-color: #37474f;
  color: #fff;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 100;
}

abbr[title]:hover::after,
[title]:not([title=""]):hover::after {
  opacity: 1;
}
`;
    rootNode.appendChild(style);

    return () => {
      style.remove();
    };
  }, [titledElements]);

  return null;
};
