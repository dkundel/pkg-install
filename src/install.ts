/** @module pkg-install */

import execa from 'execa';
import {
  defaultInstallConfig,
  InstallConfig,
  PackageManagerFlag,
} from './config';
import { getExecaConfig, getPackageList } from './helpers';
import { constructNpmArguments, npmProjectInstallArgs } from './npm';
import { getPackageManager, getPackageManagerSync } from './package-manager';
import { PackageList, Packages } from './types';
import { constructYarnArguments, yarnProjectInstallArgs } from './yarn';

export type InstallResult = execa.ExecaReturns & {
  ignoredFlags: PackageManagerFlag[];
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
 * @returns {Promise<InstallResult>}
 */
export async function install(
  packages: Packages,
  options: Partial<InstallConfig> = defaultInstallConfig
): Promise<InstallResult> {
  const config: InstallConfig = { ...defaultInstallConfig, ...options };
  const pkgManager = await getPackageManager(config);

  const packageList = getPackageList(packages);
  const getArguments =
    pkgManager === 'npm' ? constructNpmArguments : constructYarnArguments;
  const { args, ignoredFlags } = getArguments(packageList, config);

  const result = await execa(pkgManager, args, getExecaConfig(config));
  return {
    ...result,
    ignoredFlags,
  };
}

/**
 * SYNC VERSION. Installs a passed set of packages using either npm or yarn. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {InstallResult}
 */
export function installSync(
  packages: PackageList,
  options: Partial<InstallConfig> = defaultInstallConfig
): InstallResult {
  const config: InstallConfig = { ...defaultInstallConfig, ...options };
  const pkgManager = getPackageManagerSync(config);

  const packageList = getPackageList(packages);
  const getArguments =
    pkgManager === 'npm' ? constructNpmArguments : constructYarnArguments;
  const { args, ignoredFlags } = getArguments(packageList, config);

  const result = execa.sync(pkgManager, args, getExecaConfig(config));
  return {
    ...result,
    ignoredFlags,
  };
}

/**
 * Runs `npm install` or `yarn install` for the project. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {Promise<execa.ExecaReturns>}
 */
export async function projectInstall(
  options: Partial<InstallConfig> = defaultInstallConfig
): Promise<execa.ExecaReturns> {
  const config: InstallConfig = { ...defaultInstallConfig, ...options };
  const pkgManager = await getPackageManager(config);

  const args =
    pkgManager === 'npm' ? npmProjectInstallArgs : yarnProjectInstallArgs;

  return execa(pkgManager, args, getExecaConfig(config));
}

/**
 * SYNC VERSION. Runs `npm install` or `yarn install` for the project. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {execa.ExecaReturns}
 */
export function projectInstallSync(
  options: Partial<InstallConfig> = defaultInstallConfig
): execa.ExecaReturns {
  const config: InstallConfig = { ...defaultInstallConfig, ...options };
  const pkgManager = getPackageManagerSync(config);

  const args =
    pkgManager === 'npm' ? npmProjectInstallArgs : yarnProjectInstallArgs;

  return execa.sync(pkgManager, args, getExecaConfig(config));
}
