"use client";

import type { ValidationResult } from "wowlab-engine";

import { useDebounceFn, useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useEffect } from "react";

import { useEngine } from "@/components/shared/wasm";

import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import {
  INITIAL_VALIDATION_STATE,
  type RotationValidationState,
} from "./types";

export function useRotationValidation(
  specId: null | number,
): RotationValidationState {
  const content = useIntlayer("rotationEditor");
  const engine = useEngine();
  const dehydrate = useEditorDocument((s) => s.dehydrate);
  const script = useEditorDocument((s) => s.script);
  const validation = useEditorUi((s) => s.validation);
  const setValidation = useEditorUi((s) => s.setValidation);

  const validate = useMemoizedFn(() => {
    if (specId == null || specId <= 0) {
      setValidation({ ...INITIAL_VALIDATION_STATE, status: "no_spec" });

      return;
    }

    setValidation({ ...validation, status: "running" });

    try {
      const snapshot = dehydrate();
      const json = JSON.stringify(snapshot);
      const result = engine.validateRotationForSpec(
        json,
        specId,
      ) as ValidationResult;
      const errors = result.errors;
      const warnings = result.warnings;

      setValidation({
        errors,
        isValid: result.valid,
        status: errors.length > 0 ? "errors" : "ok",
        warnings,
      });
    } catch (error) {
      setValidation({
        errors: [
          {
            message:
              error instanceof Error
                ? error.message
                : content.validationCrashed.value,
            type: "invalidExpression",
          },
        ],
        isValid: false,
        status: "errors",
        warnings: [],
      });
    }
  });

  const { run } = useDebounceFn(validate, { wait: 250 });

  useEffect(() => {
    run();
  }, [script, specId, run]);

  return validation;
}
