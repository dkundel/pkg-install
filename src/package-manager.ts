import execa from 'execa';

export async function isManagerInstalled(
  manager: SupportedPackageManagers
): Promise<boolean> {
  const result = await execa(manager, ['--version']);
  return !result.failed;
}

export function isManagerInstalledSync(
  manager: SupportedPackageManagers
): boolean {
  const result = execa.sync(manager, ['--version']);
  return !result.failed;
}

export function getCurrentPackageManager(): SupportedPackageManagers | null {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) {
    return null;
  }

  if (userAgent.startsWith('npm')) {
    return 'npm';
  }

  if (userAgent.startsWith('yarn')) {
    return 'yarn';
  }

  return null;
}

export async function getPackageManager(
  config: InstallConfig
): Promise<SupportedPackageManagers> {
  let pkgManager = config.prefer || getCurrentPackageManager();

  if (!pkgManager) {
    pkgManager = 'npm';
  }

  if (!(await isManagerInstalled(pkgManager))) {
    pkgManager = pkgManager === 'npm' ? 'yarn' : 'npm';

    if (!(await isManagerInstalled(pkgManager))) {
      throw new Error('No supported package manager found');
    }
  }

  return pkgManager;
}

export function getPackageManagerSync(
  config: InstallConfig
): SupportedPackageManagers {
  let pkgManager = config.prefer || getCurrentPackageManager();

  if (!pkgManager) {
    pkgManager = 'npm';
  }

  if (!isManagerInstalledSync(pkgManager)) {
    pkgManager = pkgManager === 'npm' ? 'yarn' : 'npm';

    if (!isManagerInstalledSync(pkgManager)) {
      throw new Error('No supported package manager found');
    }
  }
  return pkgManager;
}
