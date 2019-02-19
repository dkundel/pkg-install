import execa from 'execa';
import { getExecaConfig, getPackageList } from './helpers';
import { constructNpmArguments } from './npm';
import { getPackageManager, getPackageManagerSync } from './package-manager';
import { constructYarnArguments } from './yarn';

export const defaultConfig = {
  dev: false,
  prefer: null,
  exact: false,
  noSave: false,
  bundle: false,
  verbose: false,
  global: false,
  stdio: 'pipe' as StdioOption,
  cwd: process.cwd(),
};

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
