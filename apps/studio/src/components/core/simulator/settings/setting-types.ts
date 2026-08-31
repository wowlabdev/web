export type SettingGroup = {
  group: string;
  sections: SettingSection[];
};

export type SettingSection = {
  items: WasmSettingDef[];
  section: string;
};

export type SettingValue = boolean | number | string;

export type WasmSettingDef = {
  description?: string;
  group: string;
  key: string;
  kind: WasmSettingKind;
  label: string;
  section: string;
};

export type WasmSettingKind =
  | { default: boolean; type: "bool" }
  | { default: number; max?: number; min?: number; type: "float" }
  | { default: number; max?: number; min?: number; type: "int" }
  | {
      default: string;
      options: { label: string; value: string }[];
      type: "enum";
    };

export function getDefaultValue(kind: WasmSettingKind): SettingValue {
  return kind.default;
}

export function isOverridden(
  setting: WasmSettingDef,
  value: SettingValue | undefined,
): boolean {
  if (value === undefined) {
    return false;
  }

  return value !== getDefaultValue(setting.kind);
}
