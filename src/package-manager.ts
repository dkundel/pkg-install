/** @module pkg-install */

import execa from 'execa';
import { accessSync, promises as fs } from 'fs';
import path from 'path';
import { InstallConfig, SupportedPackageManagers } from './types';

/**
 * Checks if a given package manager is currently installed by checking its version
 *
 * @export
 * @param {SupportedPackageManagers} manager
 * @returns {Promise<boolean>}
 */
export async function isManagerInstalled(
  manager: SupportedPackageManagers
): Promise<boolean> {
  const result = await execa(manager, ['--version']);
  return !result.failed;
}

/**
 * SYNC: Checks if a given package manager is currently installed by checking its version
 *
 * @export
 * @param {SupportedPackageManagers} manager
 * @returns {boolean}
 */
export function isManagerInstalledSync(
  manager: SupportedPackageManagers
): boolean {
  const result = execa.sync(manager, ['--version']);
  return !result.failed;
}

/**
 * Returns the package manager currently active if the program is executed
 * through an npm or yarn script like:
 * ```bash
 * yarn run example
 * npm run example
 * ```
 *
 * @export
 * @returns {(SupportedPackageManagers | null)}
 */
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

/**
 * Checks for the presence of package-lock.json or yarn.lock to determine which package manager is being used
 *
 * @export
 * @param {InstallConfig} config Config specifying current working directory
 * @returns
 */
export async function getPackageManagerFromLockfile(
  config: InstallConfig
): Promise<SupportedPackageManagers | null> {
  const pkgLockPath = path.join(config.cwd, 'package-lock.json');
  const yarnLockPath = path.join(config.cwd, 'yarn.lock');
  try {
    await fs.access(pkgLockPath);
    return 'npm';
  } catch (err) {
    try {
      await fs.access(yarnLockPath);
      return 'yarn';
    } catch (err) {
      return null;
    }
  }
}

/**
 * SYNC: Checks for the presence of package-lock.json or yarn.lock to determine which package manager is being used
 *
 * @export
 * @param {InstallConfig} config Config specifying current working directory
 * @returns
 */
export function getPackageManagerFromLockfileSync(
  config: InstallConfig
): SupportedPackageManagers | null {
  const pkgLockPath = path.join(config.cwd, 'package-lock.json');
  const yarnLockPath = path.join(config.cwd, 'yarn.lock');
  try {
    accessSync(pkgLockPath);
    return 'npm';
  } catch (err) {
    try {
      accessSync(yarnLockPath);
      return 'yarn';
    } catch (err) {
      return null;
    }
  }
}

/**
 * Determine what package manager to use based on what preference is set,
 * and whether it's currently running in a yarn/npm script
 *
 * @export
 * @param {InstallConfig} config
 * @returns {Promise<SupportedPackageManagers>}
 */
export async function getPackageManager(
  config: InstallConfig
): Promise<SupportedPackageManagers> {
  let pkgManager = config.prefer || getCurrentPackageManager();

  if (!pkgManager) {
    pkgManager = await getPackageManagerFromLockfile(config);
  }

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

/**
 * SYNC: Determine what package manager to use based on what preference is set,
 * and whether it's currently running in a yarn/npm script
 *
 * @export
 * @param {InstallConfig} config
 * @returns {SupportedPackageManagers}
 */
export function getPackageManagerSync(
  config: InstallConfig
): SupportedPackageManagers {
  let pkgManager: SupportedPackageManagers | null =
    config.prefer || getCurrentPackageManager();

  if (!pkgManager) {
    pkgManager = getPackageManagerFromLockfileSync(config);
  }

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
