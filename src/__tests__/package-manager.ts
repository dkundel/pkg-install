let shouldFail = false;
let mockExeca = () => {
  return {
    failed: shouldFail,
  };
};

const asyncExeca = jest
  .fn()
  .mockImplementation(() => Promise.resolve(mockExeca()));
const syncExeca = jest.fn().mockImplementation(mockExeca);
Object.defineProperty(asyncExeca, 'sync', {
  value: syncExeca,
});

jest.mock('execa', () => {
  return asyncExeca;
});

import {
  getCurrentPackageManager,
  isManagerInstalled,
  isManagerInstalledSync,
} from '../package-manager';

describe('isManagerInstalled', () => {
  it('should call execa with the right paramters', () => {
    isManagerInstalled('npm');
    expect(asyncExeca).toHaveBeenLastCalledWith('npm', ['--version']);

    isManagerInstalled('yarn');
    expect(asyncExeca).toHaveBeenLastCalledWith('yarn', ['--version']);
  });

  it('should forward the result', async () => {
    shouldFail = false;
    expect(await isManagerInstalled('npm')).toBe(true);
    shouldFail = true;
    expect(await isManagerInstalled('npm')).toBe(false);
  });
});

describe('isManagerInstalledSync', () => {
  it('should call execa with the right paramters', () => {
    isManagerInstalledSync('npm');
    expect(syncExeca).toHaveBeenLastCalledWith('npm', ['--version']);

    isManagerInstalledSync('yarn');
    expect(syncExeca).toHaveBeenLastCalledWith('yarn', ['--version']);
  });

  it('should forward the result', () => {
    shouldFail = false;
    expect(isManagerInstalledSync('npm')).toBe(true);
    shouldFail = true;
    expect(isManagerInstalledSync('npm')).toBe(false);
  });
});

describe('getCurrentPackageManager', () => {
  let envBackup: any;

  beforeEach(() => {
    envBackup = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('should handle yarn user agents', () => {
    process.env = {
      npm_config_user_agent: 'yarn/1.13.0 npm/? node/v11.6.0 darwin x64',
    };
    expect(getCurrentPackageManager()).toBe('yarn');
  });

  it('should handle npm user agents', () => {
    process.env = {
      npm_config_user_agent: 'npm/6.5.0 node/v11.6.0 darwin x64',
    };
    expect(getCurrentPackageManager()).toBe('npm');
  });

  it('should handle missing user agents', () => {
    process.env = {};
    expect(getCurrentPackageManager()).toBe(null);
  });
});
