/** @module pkg-install */

import { InstallConfig } from './config';
import { SupportedPackageManagers } from './types';
import {
  getCurrentPackageManager,
  getPackageManagerFromLockfile,
  getPackageManagerFromLockfileSync,
  isManagerInstalled,
  isManagerInstalledSync,
} from './utils/package-manager-utils';

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
