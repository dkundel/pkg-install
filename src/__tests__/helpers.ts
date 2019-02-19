import { getPackageList } from '../helpers';

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
