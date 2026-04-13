import { useEffect, useRef } from 'react';
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
  const abbrElements = useShadowRootElements<HTMLElement>([
    'abbr[title]',
    'span[title]',
  ]);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!abbrElements.length) return;

    const tooltip = document.createElement('div');
    tooltip.setAttribute('role', 'tooltip');
    Object.assign(tooltip.style, {
      position: 'fixed',
      background: 'red',
      color: '#fff',
      fontSize: '0.7rem',
      lineHeight: '1.4',
      padding: '4px 8px',
      borderRadius: '2px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: '99999',
      boxShadow: '0 2px 4px rgba(0,0,0,.3)',
      display: 'none',
    });
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const show = (text: string) => (e: MouseEvent) => {
      tooltip.textContent = text;
      tooltip.style.display = 'block';
      position(e);
    };

    const position = (e: MouseEvent) => {
      const x = e.clientX + 14;
      const y = e.clientY - 32;
      // Keep tooltip within viewport horizontally
      const maxX = window.innerWidth - tooltip.offsetWidth - 8;
      tooltip.style.left = `${Math.min(x, maxX)}px`;
      tooltip.style.top = `${Math.max(y, 8)}px`;
    };

    const hide = () => {
      tooltip.style.display = 'none';
    };

    const cleanups: (() => void)[] = [];

    abbrElements.forEach(el => {
      if (el.dataset.tooltipInit) return;
      el.dataset.tooltipInit = '1';

      const title = el.getAttribute('title') ?? '';
      if (!title) return;

      // Remove native title attribute to prevent double-tooltip (browser default + ours)
      el.removeAttribute('title');
      el.setAttribute('data-tooltip', title);
      el.style.cursor = 'help';

      const onEnter = show(title);
      const onLeave = hide;

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove', position);
      el.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mousemove', position);
        el.removeEventListener('mouseleave', onLeave);
        // Restore title so content is still accessible after unmount
        el.setAttribute('title', title);
        el.removeAttribute('data-tooltip');
        delete el.dataset.tooltipInit;
      });
    });

    return () => {
      cleanups.forEach(c => c());
      tooltip.remove();
      tooltipRef.current = null;
    };
  }, [abbrElements]);

  return null;
};
