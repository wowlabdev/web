import type { ImplementedSpecInfo } from "wowlab-common";

export type SpecClassGroup = {
  className: string;
  color: null | string;
  iconName: null | string;
  specs: SpecEntry[];
};

export type SpecPickerProps = {
  isCompact?: boolean;
  onChange: (specId: number) => void;
  specs: ImplementedSpecInfo[];
  value: null | number;
};

type SpecEntry = {
  fileName: null | string;
  specId: number;
  specName: string;
};
