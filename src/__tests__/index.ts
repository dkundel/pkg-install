import * as pkgInstall from '../index';

describe('index export', () => {
  it('exports the right things', () => {
    expect(typeof pkgInstall.install).toBe('function');
    expect(typeof pkgInstall.installSync).toBe('function');
    expect(typeof pkgInstall.projectInstall).toBe('function');
    expect(typeof pkgInstall.projectInstallSync).toBe('function');
  });
});
