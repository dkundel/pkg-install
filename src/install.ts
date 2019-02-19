/** @module pkg-install */

import execa from 'execa';
import { getExecaConfig, getPackageList } from './helpers';
import { constructNpmArguments } from './npm';
import { getPackageManager, getPackageManagerSync } from './package-manager';
import { InstallConfig, PackageList, Packages, StdioOption } from './types';
import { constructYarnArguments } from './yarn';

/**
 * Default options for `install` and `installSync`
 */
export const defaultInstallConfig = {
  /** Installs the passed dependencies as dev dependencies */
  dev: false,
  /** Allows you to "force" package manager if available */
  prefer: null,
  /** Uses the save exact functionality of pkg manager */
  exact: false,
  /** Does not write the dependency to package.json (*only available for npm*) */
  noSave: false,
  /** Saves dependency as bundled dependency (*only available for npm*) */
  bundle: false,
  /** Runs package manager in verbose mode */
  verbose: false,
  /** Installs packages globally */
  global: false,
  /** Passes to execa in which way the I/O should be passed */
  stdio: 'pipe' as StdioOption,
  /** Working directory in which to run the package manager */
  cwd: process.cwd(),
};

/**
 * Installs a passed set of packages using either npm or yarn. Depending on:
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {Promise<execa.ExecaReturns>}
 */
export async function install(
  packages: Packages,
  options: Partial<InstallConfig> = defaultInstallConfig
): Promise<execa.ExecaReturns> {
  const config: InstallConfig = { ...defaultInstallConfig, ...options };
  const pkgManager = await getPackageManager(config);

  const packageList = getPackageList(packages);
  const getArguments =
    pkgManager === 'npm' ? constructNpmArguments : constructYarnArguments;
  const args = getArguments(packageList, config);

  return execa(pkgManager, args, getExecaConfig(config));
}

/**
 * SYNC VERSION. Installs a passed set of packages using either npm or yarn. Depending on:
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {execa.ExecaReturns}
 */
export function installSync(
  packages: PackageList,
  options: Partial<InstallConfig> = defaultInstallConfig
): execa.ExecaReturns {
  const config: InstallConfig = { ...defaultInstallConfig, ...options };
  const pkgManager = getPackageManagerSync(config);

  const packageList = getPackageList(packages);
  const getArguments =
    pkgManager === 'npm' ? constructNpmArguments : constructYarnArguments;
  const args = getArguments(packageList, config);

  return execa.sync(pkgManager, args, getExecaConfig(config));
}
