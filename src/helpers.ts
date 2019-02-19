import execa from 'execa';

export function getPackageList(packages: Packages): PackageList {
  if (Array.isArray(packages)) {
    return packages.filter(pkg => typeof pkg === 'string');
  }

  const entries = Object.entries(packages);

  return entries
    .filter(([name, version]) => {
      return (
        (typeof name === 'string' && typeof version === 'string') ||
        typeof version === 'undefined'
      );
    })
    .map(([name, version]) => {
      return version ? `${name}@${version}` : name;
    });
}

export function getExecaConfig(config: InstallConfig): execa.CommonOptions {
  return {
    stdio: config.stdio,
    cwd: config.cwd,
  };
}
