import { integrationToolkitPlugin } from './plugin';

describe('integration-toolkit', () => {
  it('should export plugin', () => {
    expect(integrationToolkitPlugin).toBeDefined();
  });
});
