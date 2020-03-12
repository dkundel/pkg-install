import { defaultInstallConfig } from '../config';
import { constructYarnArguments } from '../yarn';

describe('constructYarnArguments', () => {
  const packageList = ['twilio', 'twilio-run@1'];

  it('should handle default config', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(
      packageList,
      defaultInstallConfig
    );
    expect(output).toEqual(['add', ...packageList]);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should add dev flag', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      dev: true,
    });
    expect(output).toEqual(['add', ...packageList, '--dev']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should ignore dev flag when global', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      dev: true,
      global: true,
    });
    expect(output).toEqual(['global', 'add', ...packageList]);
    expect(ignoredFlags).toEqual(['dev']);
  });

  it('should add exact flag', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      exact: true,
    });
    expect(output).toEqual(['add', ...packageList, '--exact']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should add verbose flag', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      verbose: true,
    });
    expect(output).toEqual(['add', ...packageList, '--verbose']);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should ignore noSave option', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      noSave: true,
    });
    expect(output).toEqual(['add', ...packageList]);
    expect(ignoredFlags).toEqual(['noSave']);
  });

  it('should ignore bundle option', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      bundle: true,
    });
    expect(output).toEqual(['add', ...packageList]);
    expect(ignoredFlags).toEqual(['bundle']);
  });

  it('should handle global option', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      global: true,
    });
    expect(output).toEqual(['global', 'add', ...packageList]);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should handle forceCwd flag', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
      forceCwd: true,
    });
    expect(output).toEqual(['--cwd', process.cwd(), 'add', ...packageList]);
    expect(ignoredFlags.length).toBe(0);
  });

  it('should handle all flags', () => {
    const { args: output, ignoredFlags } = constructYarnArguments(packageList, {
      ...defaultInstallConfig,
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
    expect(ignoredFlags.length).toBe(0);
  });
});
