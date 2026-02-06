import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { csitLandingPageRouteRef } from './routes';

export const integrationToolkitPlugin = createPlugin({
  id: 'integration-toolkit',
  routes: {
    csitLandingPage: csitLandingPageRouteRef,
  },
});

export const CsitLandingPage = integrationToolkitPlugin.provide(
  createRoutableExtension({
    name: 'CsitLandingPage',
    component: () =>
      import('./components/CsitLandingPage/HomePage').then(m => m.default),
    mountPoint: csitLandingPageRouteRef,
  }),
);
