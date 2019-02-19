import { InstallConfig, PackageList } from './types';

/**
 * @internal
 */

export function constructNpmArguments(
  packageList: PackageList,
  config: InstallConfig
): string[] {
  const globalCommand = config.global ? ['-g'] : [];
  const args: string[] = ['install', ...globalCommand, ...packageList];

  if (config.dev) {
    args.push('--save-dev');
  }

  if (config.exact) {
    args.push('--save-exact');
  }

  if (config.bundle) {
    args.push('--save-bundle');
  }

  if (config.noSave) {
    args.push('--no-save');
  }

  if (config.verbose) {
    args.push('--verbose');
  }

  return args;
}
