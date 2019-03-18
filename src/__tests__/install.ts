import * as installModule from '../install';

describe('install', () => {
  it('exports the right things', () => {
    expect(typeof installModule.install).toBe('function');
    expect(typeof installModule.installSync).toBe('function');
    expect(typeof installModule.projectInstall).toBe('function');
    expect(typeof installModule.projectInstallSync).toBe('function');
  });
});
