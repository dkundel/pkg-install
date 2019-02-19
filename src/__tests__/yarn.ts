import { defaultConfig } from '../install';
import { constructYarnArguments } from '../yarn';

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

  it('should ignore noSave option', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      noSave: true,
    });
    expect(output).toEqual(['add', ...packageList]);
  });

  it('should ignore bundle option', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      bundle: true,
    });
    expect(output).toEqual(['add', ...packageList]);
  });

  it('should handle global option', () => {
    const output = constructYarnArguments(packageList, {
      ...defaultConfig,
      global: true,
    });
    expect(output).toEqual(['global', 'add', ...packageList]);
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
