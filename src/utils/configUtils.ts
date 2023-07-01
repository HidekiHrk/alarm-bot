type ConfigConstructor =
  | StringConstructor
  | NumberConstructor
  | ArrayConstructor;

type ConfigReturnType<V extends ConfigConstructor> = V extends ArrayConstructor
  ? string[]
  : ReturnType<V>;

export function getConfig<V extends ConfigConstructor>(
  key: string,
  configType: V,
  defaultValue?: ConfigReturnType<V>
): ConfigReturnType<V> {
  const raw = process.env?.[key];
  if (!raw) return defaultValue as any;
  else {
    switch (configType) {
      case Number:
        return parseFloat(raw) as any;
      case Array:
        return raw.split(";").filter(Boolean) as any;
      case String:
      default:
        return raw as any;
    }
  }
}
