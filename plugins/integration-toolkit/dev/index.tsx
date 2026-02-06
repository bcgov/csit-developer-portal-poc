import { createDevApp } from '@backstage/dev-utils';
import { integrationToolkitPlugin, CsitLandingPage } from '../src/plugin';

createDevApp()
  .registerPlugin(integrationToolkitPlugin)
  .addPage({
    element: <CsitLandingPage />,
    title: 'CSIT Landing Page',
    path: '/integration-toolkit',
  })
  .render();
