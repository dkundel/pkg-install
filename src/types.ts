/** @module pkg-install */

export type PackageMap = {
  [packageName: string]: string | undefined;
};

export type PackageList = string[];
export type Packages = PackageMap | PackageList;
export type SupportedPackageManagers = 'yarn' | 'npm';

/**
 * What to do with I/O. This is passed to `execa`
 */
export type StdioOption = 'pipe' | 'ignore' | 'inherit';

/**
 * Available options to modify the behavior of `install` and `installSync`
 */
export type InstallConfig = {
  /** Allows you to "force" package manager if available */
  prefer: SupportedPackageManagers | null;
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
  /** Installs packages globally */
  global: boolean;
  /** Passes to execa in which way the I/O should be passed */
  stdio: StdioOption | StdioOption[];
  /** Working directory in which to run the package manager */
  cwd: string;
};
