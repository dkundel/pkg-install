import { defaultInstallConfig } from '../config';
import { constructNpmArguments } from '../npm';

describe('constructNpmArguments', () => {
  const packageList = ['twilio', 'twilio-run@1'];

  it('should handle default config', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(
      packageList,
      defaultInstallConfig
    );
    expect(output).toEqual(['install', ...packageList]);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should add dev flag', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      dev: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-dev']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should ignore dev flag when global', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      dev: true,
      global: true,
    });
    expect(output).toEqual(['install', '-g', ...packageList]);
    expect(ignoredFlags).toEqual(['dev']);
  });

  it('should add exact flag', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      exact: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-exact']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should add verbose flag', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      verbose: true,
    });
    expect(output).toEqual(['install', ...packageList, '--verbose']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should add bundle flag', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      bundle: true,
    });
    expect(output).toEqual(['install', ...packageList, '--save-bundle']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should handle noSave flag', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      noSave: true,
    });
    expect(output).toEqual(['install', ...packageList, '--no-save']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should handle global flag', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
      ...defaultInstallConfig,
      global: true,
    });
    expect(output).toEqual(['install', '-g', ...packageList]);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should handle all flags', () => {
    const { args: output, ignoredFlags } = constructNpmArguments(packageList, {
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
    expect(ignoredFlags.length).toBe(0);
  });
});
