import {
  PackageManagerFlag,
  PackageManagerFlagConfig,
  ValidPackageFlags,
} from './config';

export function getFlagsToSet(
  config: PackageManagerFlagConfig
): PackageManagerFlag[] {
  return Object.entries(config)
    .filter(entry => {
      const [flag, value] = entry;
      if (!value) {
        return false;
      }
      return ValidPackageFlags.has(flag);
    })
    .map(entry => {
      return entry[0] as PackageManagerFlag;
    });
}
