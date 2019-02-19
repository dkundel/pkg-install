import execa from 'execa';

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
  stdio: StdioOption | StdioOption[];
  cwd: string;
};

export const defaultConfig = {
  dev: false,
  prefer: null,
  exact: false,
  noSave: false,
  bundle: false,
  verbose: false,
  stdio: 'pipe' as StdioOption,
  cwd: process.cwd(),
};

export function getPackageList(packages: Packages): PackageList {
  if (Array.isArray(packages)) {
    return packages.filter(pkg => typeof pkg === 'string');
  }

  const entries = Object.entries(packages);

  return entries
    .filter(([name, version]) => {
      return (
        (typeof name === 'string' && typeof version === 'string') ||
        typeof version === 'undefined'
      );
    })
    .map(([name, version]) => {
      return version ? `${name}@${version}` : name;
    });
}

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

export function constructYarnArguments(
  packageList: PackageList,
  config: InstallConfig
): string[] {
  const args: string[] = ['add', ...packageList];

  if (config.dev) {
    args.push('--dev');
  }

  if (config.exact) {
    args.push('--exact');
  }

  if (config.verbose) {
    args.push('--verbose');
  }

  return args;
}

export function constructNpmArguments(
  packageList: PackageList,
  config: InstallConfig
): string[] {
  const args: string[] = ['install', ...packageList];

  if (config.dev) {
    args.push('--save-dev');
  }

  if (config.exact) {
    args.push('--save-exact');
  }

  if (config.bundle) {
    args.push('--save-bundle');
  }

  if (config.noSave) {
    args.push('--no-save');
  }

  if (config.verbose) {
    args.push('--verbose');
  }

  return args;
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

function getExecaConfig(config: InstallConfig): execa.CommonOptions {
  return {
    stdio: config.stdio,
    cwd: config.cwd,
  };
}

export async function install(
  packages: Packages,
  options: Partial<InstallConfig> = {}
): Promise<execa.ExecaReturns> {
  const config: InstallConfig = { ...defaultConfig, ...options };
  const pkgManager = await getPackageManager(config);

  const packageList = getPackageList(packages);
  const getArguments =
    pkgManager === 'npm' ? constructNpmArguments : constructYarnArguments;
  const args = getArguments(packageList, config);

  return execa(pkgManager, args, getExecaConfig(config));
}

export function installSync(
  packages: PackageList,
  options: Partial<InstallConfig>
): execa.ExecaReturns {
  const config: InstallConfig = { ...defaultConfig, ...options };
  const pkgManager = getPackageManagerSync(config);

  const packageList = getPackageList(packages);
  const getArguments =
    pkgManager === 'npm' ? constructNpmArguments : constructYarnArguments;
  const args = getArguments(packageList, config);

  return execa.sync(pkgManager, args, getExecaConfig(config));
}
