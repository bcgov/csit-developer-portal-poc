import { createDevApp } from '@backstage/dev-utils';
import { devhubDesignPluginDemoPlugin, DevhubDesignPluginDemoPage } from '../src/plugin';

createDevApp()
  .registerPlugin(devhubDesignPluginDemoPlugin)
  .addPage({
    element: <DevhubDesignPluginDemoPage />,
    title: 'Root Page',
    path: '/devhub-design-plugin-demo',
  })
  .render();
