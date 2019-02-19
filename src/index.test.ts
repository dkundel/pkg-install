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
  constructNpmArguments,
  constructYarnArguments,
  defaultConfig,
  getCurrentPackageManager,
  getPackageList,
  isManagerInstalled,
  isManagerInstalledSync,
} from './';

describe('getPackageList', () => {
  it('should handle arrays', () => {
    const input = ['twilio', 'node-env-run@1', 'twilio-run@1'];
    const output = getPackageList(input);
    expect(output).toEqual(input);
  });

  it('should filter out empty or invalid values', () => {
    const input = ['twilio', undefined, 1.23, 'node-env-run@1'];
    // @ts-ignore
    const output = getPackageList(input);
    expect(output).toEqual(['twilio', 'node-env-run@1']);
  });

  it('should turn objects into arrays', () => {
    const input = {
      twilio: '^3',
      'node-env-run': '1',
      'twilio-run': undefined,
    };
    const output = getPackageList(input);
    expect(output).toEqual(['twilio@^3', 'node-env-run@1', 'twilio-run']);
  });
});

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

describe('constructYarnArguments', () => {
  const packageList = ['twilio', 'twilio-run@1'];

  it('should handle default config', () => {
    const output = constructYarnArguments(packageList, defaultConfig);
    expect(output).toEqual(['add', ...packageList]);
  });

  it('should add dev flag', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      dev: true,
    });
    expect(output).toEqual(['add', ...packageList, '--dev']);
  });

  it('should add exact flag', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      exact: true,
    });
    expect(output).toEqual(['add', ...packageList, '--exact']);
  });

  it('should add verbose flag', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      verbose: true,
    });
    expect(output).toEqual(['add', ...packageList, '--verbose']);
  });

  it('shoud ignore noSave option', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      noSave: true,
    });
    expect(output).toEqual(['add', ...packageList]);
  });

  it('shoud ignore bundle option', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      bundle: true,
    });
    expect(output).toEqual(['add', ...packageList]);
  });

  it('should handle all flags', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      dev: true,
      exact: true,
      verbose: true,
    });
    expect(output).toEqual([
      'add',
      ...packageList,
      '--dev',
      '--exact',
      '--verbose',
    ]);
  });
});

describe('constructNpmArguments', () => {
  const packageList = ['twilio', 'twilio-run@1'];

  it('should handle default config', () => {
    const output = constructNpmArguments(packageList, defaultConfig);
    expect(output).toEqual(['install', ...packageList]);
  });

  it('should add dev flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultConfig,
      dev: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-dev']);
  });

  it('should add exact flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultConfig,
      exact: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-exact']);
  });

  it('should add verbose flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultConfig,
      verbose: true,
    });
    expect(output).toEqual(['install', ...packageList, '--verbose']);
  });

  it('should add bundle flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultConfig,
      bundle: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-bundle']);
  });

  it('should handle noSave flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultConfig,
      noSave: true,
    });
    expect(output).toEqual(['install', ...packageList, '--no-save']);
  });

  it('should handle all flags', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultConfig,
      dev: true,
      exact: true,
      verbose: true,
    });
    expect(output).toEqual([
      'install',
      ...packageList,
      '--save-dev',
      '--save-exact',
      '--verbose',
    ]);
  });
});
