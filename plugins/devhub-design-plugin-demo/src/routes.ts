import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'devhub-design-plugin-demo',
});

export const csitLandingPageRouteRef = createRouteRef({
  id: 'csit-landing-page',
});
