const mockGetCurrentPm = jest.fn();
const mockGetPmFromLock = jest.fn();
const mockIsManagerInstalled = jest.fn();
const mockGetPmFromLockSync = jest.fn();
const mockIsManagerInstalledSync = jest.fn();

jest.mock('../utils/package-manager-utils', () => {
  return {
    getCurrentPackageManager: mockGetCurrentPm,
    getPackageManagerFromLockfile: mockGetPmFromLock,
    isManagerInstalled: mockIsManagerInstalled,
    isManagerInstalledSync: mockIsManagerInstalledSync,
    getPackageManagerFromLockfileSync: mockGetPmFromLockSync,
  };
});

import { defaultInstallConfig, InstallConfig } from '../config';
import { getPackageManager, getPackageManagerSync } from '../package-manager';

describe('getPackageManager', () => {
  const config = {
    ...defaultInstallConfig,
    cwd: '/',
  };

  beforeEach(() => {
    mockGetCurrentPm.mockRestore();
    mockGetCurrentPm.mockImplementation(() => null);
    mockGetPmFromLock.mockRestore();
    mockGetPmFromLock.mockImplementation(() => null);
    mockIsManagerInstalled.mockRestore();
    mockIsManagerInstalled.mockImplementation(() => Promise.resolve(true));
  });

  it('should respect the prefer flag', async () => {
    const preferYarnConfig = { ...config, prefer: 'yarn' } as InstallConfig;
    expect(await getPackageManager(preferYarnConfig)).toBe('yarn');
    const preferNpmConfig = { ...config, prefer: 'npm' } as InstallConfig;
    expect(await getPackageManager(preferNpmConfig)).toBe('npm');
  });

  it('should fallback to getCurrentPackageManager', async () => {
    mockGetCurrentPm.mockImplementationOnce(() => 'npm');
    expect(await getPackageManager(config)).toBe('npm');
    mockGetCurrentPm.mockImplementationOnce(() => 'yarn');
    expect(await getPackageManager(config)).toBe('yarn');
  });

  it('should try to read from lockfile', async () => {
    mockGetPmFromLock.mockImplementationOnce(() => 'npm');
    expect(await getPackageManager(config)).toBe('npm');
    mockGetPmFromLock.mockImplementationOnce(() => 'yarn');
    expect(await getPackageManager(config)).toBe('yarn');
  });

  it('should always fallback to npm', async () => {
    expect(await getPackageManager(config)).toBe('npm');
  });

  it('should try the other package manager if one is missing', async () => {
    mockIsManagerInstalled.mockImplementation(manager => {
      return Promise.resolve(manager === 'yarn' ? false : true);
    });
    let c = { ...config, prefer: 'yarn' } as InstallConfig;
    expect(await getPackageManager(c)).toBe('npm');
    expect(mockIsManagerInstalled).toHaveBeenCalledTimes(2);
    expect(mockIsManagerInstalled).toHaveBeenCalledWith('yarn');
    expect(mockIsManagerInstalled).toHaveBeenLastCalledWith('npm');

    mockIsManagerInstalled.mockClear();
    mockIsManagerInstalled.mockImplementation(manager => {
      return Promise.resolve(manager === 'npm' ? false : true);
    });
    c = { ...config, prefer: 'npm' } as InstallConfig;
    expect(await getPackageManager(c)).toBe('yarn');
    expect(mockIsManagerInstalled).toHaveBeenCalledTimes(2);
    expect(mockIsManagerInstalled).toHaveBeenCalledWith('npm');
    expect(mockIsManagerInstalled).toHaveBeenLastCalledWith('yarn');
  });

  it('should throw an error if no manager is installed', async () => {
    const c = { ...config, prefer: 'yarn' } as InstallConfig;
    mockIsManagerInstalled.mockImplementation(() => Promise.resolve(false));
    try {
      await getPackageManager(c);
    } catch (err) {
      expect(err.message).toBe('No supported package manager found');
    }
  });
});

describe('getPackageManagerSync', () => {
  const config = {
    ...defaultInstallConfig,
    cwd: '/',
  };

  beforeEach(() => {
    mockGetCurrentPm.mockRestore();
    mockGetCurrentPm.mockImplementation(() => null);
    mockGetPmFromLockSync.mockRestore();
    mockGetPmFromLockSync.mockImplementation(() => null);
    mockIsManagerInstalledSync.mockRestore();
    mockIsManagerInstalledSync.mockImplementation(() => true);
  });

  it('should respect the prefer flag', () => {
    const preferYarnConfig = { ...config, prefer: 'yarn' } as InstallConfig;
    expect(getPackageManagerSync(preferYarnConfig)).toBe('yarn');
    const preferNpmConfig = { ...config, prefer: 'npm' } as InstallConfig;
    expect(getPackageManagerSync(preferNpmConfig)).toBe('npm');
  });

  it('should fallback to getCurrentPackageManager', () => {
    mockGetCurrentPm.mockImplementationOnce(() => 'npm');
    expect(getPackageManagerSync(config)).toBe('npm');
    mockGetCurrentPm.mockImplementationOnce(() => 'yarn');
    expect(getPackageManagerSync(config)).toBe('yarn');
  });

  it('should try to read from lockfile', () => {
    mockGetPmFromLockSync.mockImplementationOnce(() => 'npm');
    expect(getPackageManagerSync(config)).toBe('npm');
    mockGetPmFromLockSync.mockImplementationOnce(() => 'yarn');
    expect(getPackageManagerSync(config)).toBe('yarn');
  });

  it('should always fallback to npm', () => {
    expect(getPackageManagerSync(config)).toBe('npm');
  });

  it('should try the other package manager if one is missing', () => {
    mockIsManagerInstalledSync.mockImplementation(manager => {
      return manager === 'yarn' ? false : true;
    });
    let c = { ...config, prefer: 'yarn' } as InstallConfig;
    expect(getPackageManagerSync(c)).toBe('npm');
    expect(mockIsManagerInstalledSync).toHaveBeenCalledTimes(2);
    expect(mockIsManagerInstalledSync).toHaveBeenCalledWith('yarn');
    expect(mockIsManagerInstalledSync).toHaveBeenLastCalledWith('npm');

    mockIsManagerInstalledSync.mockClear();
    mockIsManagerInstalledSync.mockImplementation(manager => {
      return manager === 'npm' ? false : true;
    });

    c = { ...config, prefer: 'npm' } as InstallConfig;
    expect(getPackageManagerSync(c)).toBe('yarn');
    expect(mockIsManagerInstalledSync).toHaveBeenCalledTimes(2);
    expect(mockIsManagerInstalledSync).toHaveBeenCalledWith('npm');
    expect(mockIsManagerInstalledSync).toHaveBeenLastCalledWith('yarn');
  });

  it('should throw an error if no manager is installed', () => {
    const c = { ...config, prefer: 'yarn' } as InstallConfig;
    mockIsManagerInstalledSync.mockImplementation(() => false);
    try {
      getPackageManagerSync(c);
    } catch (err) {
      expect(err.message).toBe('No supported package manager found');
    }
  });
});
