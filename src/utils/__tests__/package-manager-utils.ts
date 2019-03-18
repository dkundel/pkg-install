let shouldFailExeca = false;
let mockExeca = () => {
  return {
    failed: shouldFailExeca,
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

let accessShouldFailOn: string[] = [];
let mockAccess = jest.fn().mockImplementation((path, callback) => {
  if (!accessShouldFailOn.includes(path)) {
    return callback(null);
  } else {
    return callback(new Error('Unit test failure message'));
  }
});
let mockAccessSync = jest.fn().mockImplementation(path => {
  if (!accessShouldFailOn.includes(path)) {
    return {};
  } else {
    throw new Error('Unit test failure message');
  }
});
jest.mock('fs', () => {
  return {
    access: mockAccess,
    accessSync: mockAccessSync,
  };
});

import { defaultInstallConfig } from '../../config';
import {
  getCurrentPackageManager,
  getPackageManagerFromLockfile,
  getPackageManagerFromLockfileSync,
  isManagerInstalled,
  isManagerInstalledSync,
} from '../package-manager-utils';

describe('isManagerInstalled', () => {
  it('should call execa with the right paramters', () => {
    isManagerInstalled('npm');
    expect(asyncExeca).toHaveBeenLastCalledWith('npm', ['--version']);

    isManagerInstalled('yarn');
    expect(asyncExeca).toHaveBeenLastCalledWith('yarn', ['--version']);
  });

  it('should forward the result', async () => {
    shouldFailExeca = false;
    expect(await isManagerInstalled('npm')).toBe(true);
    shouldFailExeca = true;
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
    shouldFailExeca = false;
    expect(isManagerInstalledSync('npm')).toBe(true);
    shouldFailExeca = true;
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

  it('should handle invalid user agents', () => {
    process.env = {
      npm_config_user_agent: 'some-invalid-value',
    };
    expect(getCurrentPackageManager()).toBe(null);
  });
});

describe('getPackageManagerFromLockfile', () => {
  const config = {
    ...defaultInstallConfig,
    cwd: '/',
  };

  it('should check for npm', async () => {
    accessShouldFailOn = [];
    expect(await getPackageManagerFromLockfile(config)).toBe('npm');
  });

  it('should check for yarn if npm does not exist', async () => {
    accessShouldFailOn = ['/package-lock.json'];
    expect(await getPackageManagerFromLockfile(config)).toBe('yarn');
  });

  it('should return null if no lock file exists', async () => {
    accessShouldFailOn = ['/package-lock.json', '/yarn.lock'];
    expect(await getPackageManagerFromLockfile(config)).toBe(null);
  });
});

describe('getPackageManagerFromLockfileSync', () => {
  const config = {
    ...defaultInstallConfig,
    cwd: '/',
  };

  it('should check for npm', () => {
    accessShouldFailOn = [];
    expect(getPackageManagerFromLockfileSync(config)).toBe('npm');
  });

  it('should check for yarn if npm does not exist', () => {
    accessShouldFailOn = ['/package-lock.json'];
    expect(getPackageManagerFromLockfileSync(config)).toBe('yarn');
  });

  it('should return null if no lock file exists', () => {
    accessShouldFailOn = ['/package-lock.json', '/yarn.lock'];
    expect(getPackageManagerFromLockfileSync(config)).toBe(null);
  });
});
