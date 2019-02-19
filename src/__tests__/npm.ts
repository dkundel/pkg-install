import { defaultInstallConfig } from '../install';
import { constructNpmArguments } from '../npm';

describe('constructNpmArguments', () => {
  const packageList = ['twilio', 'twilio-run@1'];

  it('should handle default config', () => {
    const output = constructNpmArguments(packageList, defaultInstallConfig);
    expect(output).toEqual(['install', ...packageList]);
  });

  it('should add dev flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      dev: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-dev']);
  });

  it('should add exact flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      exact: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-exact']);
  });

  it('should add verbose flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      verbose: true,
    });
    expect(output).toEqual(['install', ...packageList, '--verbose']);
  });

  it('should add bundle flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      bundle: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-bundle']);
  });

  it('should handle noSave flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      noSave: true,
    });
    expect(output).toEqual(['install', ...packageList, '--no-save']);
  });

  it('should handle global flag', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      global: true,
    });
    expect(output).toEqual(['install', '-g', ...packageList]);
  });

  it('should handle all flags', () => {
    const output = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
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
