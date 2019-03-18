import { PackageManagerFlag } from './config';

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

export type ConstructArgumentsResult = {
  args: string[];
  ignoredFlags: PackageManagerFlag[];
};
