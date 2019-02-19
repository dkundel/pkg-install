export function constructYarnArguments(
  packageList: PackageList,
  config: InstallConfig
): string[] {
  const globalCommand = config.global ? ['global'] : [];
  const args: string[] = [...globalCommand, 'add', ...packageList];

  if (config.dev) {
    args.push('--dev');
  }

  if (config.exact) {
    args.push('--exact');
  }

  if (config.verbose) {
    args.push('--verbose');
  }

  return args;
}
