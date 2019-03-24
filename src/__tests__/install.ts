jest.mock('execa');
jest.mock('../package-manager', () => {
  const getPackageManager = jest.fn().mockImplementation(() => {
    return Promise.resolve('npm');
  });
  const getPackageManagerSync = jest.fn().mockReturnValue('npm');
  return {
    getPackageManager,
    getPackageManagerSync,
  };
});
jest.mock('../npm', () => {
  return {
    npmProjectInstallArgs: ['install'],
    constructNpmArguments: jest.fn().mockImplementation(pkgList => {
      return ['install', ...pkgList];
    }),
  };
});

jest.mock('../yarn', () => {
  return {
    yarnProjectInstallArgs: ['install'],
    constructYarnArguments: jest.fn().mockImplementation(pkgList => {
      return ['add', ...pkgList];
    }),
  };
});

import execa from 'execa';
import { defaultInstallConfig } from '../config';
import {
  install,
  installSync,
  projectInstall,
  projectInstallSync,
} from '../install';
import { constructNpmArguments } from '../npm';
import { getPackageManager, getPackageManagerSync } from '../package-manager';
import { constructYarnArguments } from '../yarn';

beforeEach(() => {
  ((execa as unknown) as jest.Mock).mockClear();
  (execa.sync as jest.Mock).mockClear();
});

describe('install', () => {
  beforeEach(() => {
    (constructNpmArguments as jest.Mock).mockClear();
    (constructYarnArguments as jest.Mock).mockClear();
  });

  it('should execute execa', async () => {
    const result = await install(['twilio']);
    expect(execa).toHaveBeenCalledTimes(1);
  });

  it('should merge settings correctly', async () => {
    const result = await install(['twilio'], {
      noSave: true,
      global: true,
    });
    const expectedConfig = {
      ...defaultInstallConfig,
      noSave: true,
      global: true,
    };
    expect(getPackageManager).toHaveBeenCalledWith(expectedConfig);
  });

  it('should call the right argument constructor (npm)', async () => {
    (getPackageManager as jest.Mock).mockReturnValueOnce(
      Promise.resolve('npm')
    );
    const result = await install(['twilio']);
    expect(constructNpmArguments).toHaveBeenCalledTimes(1);
    expect(constructNpmArguments).toHaveBeenCalledWith(
      ['twilio'],
      defaultInstallConfig
    );
    expect(constructYarnArguments).toHaveBeenCalledTimes(0);
  });

  it('should call the right argument constructor (yarn)', async () => {
    (getPackageManager as jest.Mock).mockReturnValueOnce(
      Promise.resolve('yarn')
    );
    const result = await install(['twilio']);
    expect(constructYarnArguments).toHaveBeenCalledTimes(1);
    expect(constructYarnArguments).toHaveBeenCalledWith(
      ['twilio'],
      defaultInstallConfig
    );
    expect(constructNpmArguments).toHaveBeenCalledTimes(0);
  });
});

describe('installSync', () => {
  beforeEach(() => {
    (constructNpmArguments as jest.Mock).mockClear();
    (constructYarnArguments as jest.Mock).mockClear();
  });

  it('should execute execa.sync', () => {
    const result = installSync(['twilio']);
    expect(execa.sync).toHaveBeenCalledTimes(1);
  });

  it('should merge settings correctly', () => {
    const result = installSync(['twilio'], {
      noSave: true,
      global: true,
    });
    const expectedConfig = {
      ...defaultInstallConfig,
      noSave: true,
      global: true,
    };
    expect(getPackageManager).toHaveBeenCalledWith(expectedConfig);
  });

  it('should call the right argument constructor (npm)', () => {
    (getPackageManagerSync as jest.Mock).mockReturnValueOnce('npm');
    const result = installSync(['twilio']);
    expect(constructNpmArguments).toHaveBeenCalledTimes(1);
    expect(constructNpmArguments).toHaveBeenCalledWith(
      ['twilio'],
      defaultInstallConfig
    );
    expect(constructYarnArguments).toHaveBeenCalledTimes(0);
  });

  it('should call the right argument constructor (yarn)', () => {
    (getPackageManagerSync as jest.Mock).mockReturnValueOnce('yarn');
    const result = installSync(['twilio']);
    expect(constructYarnArguments).toHaveBeenCalledTimes(1);
    expect(constructYarnArguments).toHaveBeenCalledWith(
      ['twilio'],
      defaultInstallConfig
    );
    expect(constructNpmArguments).toHaveBeenCalledTimes(0);
  });
});

describe('projectInstall', () => {
  it('should call execa with the right arguments (npm)', async () => {
    (getPackageManager as jest.Mock).mockResolvedValueOnce('npm');
    const result = await projectInstall();
    expect(execa).toHaveBeenCalledWith('npm', ['install'], {
      stdio: 'pipe',
      cwd: process.cwd(),
    });
  });

  it('should call execa with the right arguments (yarn)', async () => {
    (getPackageManager as jest.Mock).mockResolvedValueOnce('yarn');
    const result = await projectInstall();
    expect(execa).toHaveBeenCalledWith('yarn', ['install'], {
      stdio: 'pipe',
      cwd: process.cwd(),
    });
  });

  it('merges config correctly', async () => {
    const expectedConfig = {
      ...defaultInstallConfig,
      stdio: 'inherit',
    };

    const result = await projectInstall({ stdio: 'inherit' });
    expect(getPackageManager).toHaveBeenLastCalledWith(expectedConfig);
  });
});

describe('projectInstallSync', () => {
  it('should call execa.sync with the right arguments (npm)', () => {
    (getPackageManagerSync as jest.Mock).mockReturnValueOnce('npm');
    const result = projectInstallSync();
    expect(execa.sync).toHaveBeenCalledWith('npm', ['install'], {
      stdio: 'pipe',
      cwd: process.cwd(),
    });
  });

  it('should call execa.sync with the right arguments (yarn)', () => {
    (getPackageManagerSync as jest.Mock).mockReturnValueOnce('yarn');
    const result = projectInstallSync();
    expect(execa.sync).toHaveBeenCalledWith('yarn', ['install'], {
      stdio: 'pipe',
      cwd: process.cwd(),
    });
  });

  it('merges config correctly', () => {
    const expectedConfig = {
      ...defaultInstallConfig,
      stdio: 'inherit',
    };

    const result = projectInstallSync({ stdio: 'inherit' });
    expect(getPackageManagerSync).toHaveBeenLastCalledWith(expectedConfig);
  });
});
