import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef, csitLandingPageRouteRef } from './routes';

export const devhubDesignPluginDemoPlugin = createPlugin({
  id: 'devhub-design-plugin-demo',
  routes: {
    root: rootRouteRef,
    csitLandingPage: csitLandingPageRouteRef,
  },
});

export const DevhubDesignPluginDemoPage = devhubDesignPluginDemoPlugin.provide(
  createRoutableExtension({
    name: 'DevhubDesignPluginDemoPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const CsitLandingPage = devhubDesignPluginDemoPlugin.provide(
  createRoutableExtension({
    name: 'CsitLandingPage',
    component: () =>
      import('./components/CsitLandingPage/HomePage').then(m => m.default),
    mountPoint: csitLandingPageRouteRef,
  }),
);
