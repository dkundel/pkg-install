import { InstallConfig, PackageManagerFlag } from './config';
import { getFlagsToSet } from './flags';
import { UnreachableCaseError } from './helpers';
import { ConstructArgumentsResult, PackageList } from './types';

export function constructNpmArguments(
  packageList: PackageList,
  config: InstallConfig
): ConstructArgumentsResult {
  const flagsToSet = getFlagsToSet(config);
  const globalCommand = config.global ? ['-g'] : [];
  const args: string[] = ['install', ...globalCommand, ...packageList];

  const ignoredFlags: PackageManagerFlag[] = [];
  flagsToSet.forEach(flag => {
    switch (flag) {
      case 'dev':
        if (!config.global) {
          args.push('--save-dev');
        } else {
          ignoredFlags.push(flag);
        }
        break;
      case 'exact':
        args.push('--save-exact');
        break;
      case 'verbose':
        args.push('--verbose');
        break;
      case 'bundle':
        args.push('--save-bundle');
        break;
      case 'noSave':
        args.push('--no-save');
        break;
      /* istanbul ignore next */
      default:
        throw new UnreachableCaseError(flag);
    }
  });

  return { args, ignoredFlags };
}

export const npmProjectInstallArgs = ['install'];
