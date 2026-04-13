import { createPlugin } from '@backstage/core-plugin-api';
import {
  createTechDocsAddonExtension,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { TooltipAddon } from './addons/TooltipAddon';

export const techDocsTooltipPlugin = createPlugin({
  id: 'techdocs-tooltip',
});

export const TechDocsTooltip = techDocsTooltipPlugin.provide(
  createTechDocsAddonExtension({
    name: 'TechDocsTooltip',
    location: TechDocsAddonLocations.Content,
    component: TooltipAddon,
  }),
);
