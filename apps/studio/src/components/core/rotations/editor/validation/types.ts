import type { ValidationError, ValidationWarning } from "wowlab-engine";

export type RotationValidationState = {
  errors: ValidationError[];
  isValid: boolean | null;
  status: RotationValidationStatus;
  warnings: ValidationWarning[];
};

export type RotationValidationStatus =
  "errors" | "idle" | "no_spec" | "ok" | "running";

export const INITIAL_VALIDATION_STATE: RotationValidationState = {
  errors: [],
  isValid: null,
  status: "idle",
  warnings: [],
};
