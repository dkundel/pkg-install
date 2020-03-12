import { StdioOption, SupportedPackageManagers } from './types';

export type PackageManagerFlagConfig = {
  /** Installs the passed dependencies as dev dependencies */
  dev: boolean;
  /** Uses the save exact functionality of pkg manager */
  exact: boolean;
  /** Does not write the dependency to package.json (*only available for npm*) */
  noSave: boolean;
  /** Saves dependency as bundled dependency (*only available for npm*) */
  bundle: boolean;
  /** Runs package manager in verbose mode */
  verbose: boolean;
};

export type PackageManagerFlag = keyof PackageManagerFlagConfig;
export const ValidPackageFlags = new Set<string>([
  'dev',
  'exact',
  'noSave',
  'bundle',
  'verbose',
]);

export type ProjectInstallFlagConfig = {
  dryRun: boolean;
  verbose: boolean;
};
export type ProjectInstallFlag = keyof ProjectInstallFlagConfig;
export const ValidProjectInstallFlags = new Set<string>(['dryRun', 'verbose']);

export type GenericInstallConfig = {
  /** Allows you to "force" package manager if available */
  prefer: SupportedPackageManagers | null;
  /** Passes to execa in which way the I/O should be passed */
  stdio: StdioOption | StdioOption[];
  /** Working directory in which to run the package manager */
  cwd: string;
};

/**
 * Available options to modify the behavior of `install` and `installSync`
 */
export type InstallConfig = PackageManagerFlagConfig &
  GenericInstallConfig & {
    /** Installs packages globally */
    global: boolean;
    /** Passes cwd value within the parameters */
    forceCwd: boolean;
  };

export type ProjectInstallConfig = GenericInstallConfig &
  ProjectInstallFlagConfig & {};

/**
 * Default options for `install` and `installSync`
 */
export const defaultInstallConfig: InstallConfig = {
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
  /** Passes cwd value within the parameters */
  forceCwd: false
};
