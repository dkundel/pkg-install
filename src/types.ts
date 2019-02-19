type PackageMap = {
  [packageName: string]: string | undefined;
};

type PackageList = string[];
type Packages = PackageMap | PackageList;
type SupportedPackageManagers = 'yarn' | 'npm';
type StdioOption = 'pipe' | 'ignore' | 'inherit';
type InstallConfig = {
  prefer: SupportedPackageManagers | null;
  dev: boolean;
  exact: boolean;
  noSave: boolean;
  bundle: boolean;
  verbose: boolean;
  global: boolean;
  stdio: StdioOption | StdioOption[];
  cwd: string;
};
