import { InstallConfig, PackageManagerFlag } from './config';
import { getFlagsToSet } from './flags';
import { UnreachableCaseError } from './helpers';
import { ConstructArgumentsResult, PackageList } from './types';

export function constructYarnArguments(
  packageList: PackageList,
  config: InstallConfig
): ConstructArgumentsResult {
  const flagsToSet = getFlagsToSet(config);
  const globalCommand = config.global ? ['global'] : [];
  const cwdCommand = config.forceCwd ? ['--cwd', config.cwd] : [];
  const args: string[] = [...cwdCommand, ...globalCommand, 'add', ...packageList];

  const ignoredFlags: PackageManagerFlag[] = [];
  flagsToSet.forEach(flag => {
    switch (flag) {
      case 'dev':
        if (!config.global) {
          args.push('--dev');
        } else {
          ignoredFlags.push(flag);
        }
        break;
      case 'exact':
        args.push('--exact');
        break;
      case 'verbose':
        args.push('--verbose');
        break;
      case 'bundle':
      case 'noSave':
        ignoredFlags.push(flag);
        break;
      /* istanbul ignore next */
      default:
        throw new UnreachableCaseError(flag);
    }
  });

  return { args, ignoredFlags };
}

export const yarnProjectInstallArgs = ['install'];
