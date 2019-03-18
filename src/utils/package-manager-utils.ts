/** @module pkg-install */

import execa from 'execa';
import { access as fsAccess, accessSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { InstallConfig } from '../config';
import { SupportedPackageManagers } from '../types';

const access = promisify(fsAccess);

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
    await access(pkgLockPath);
    return 'npm';
  } catch (err) {
    try {
      await access(yarnLockPath);
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
