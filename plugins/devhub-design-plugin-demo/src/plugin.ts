import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const devhubDesignPluginDemoPlugin = createPlugin({
  id: 'devhub-design-plugin-demo',
  routes: {
    root: rootRouteRef,
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
