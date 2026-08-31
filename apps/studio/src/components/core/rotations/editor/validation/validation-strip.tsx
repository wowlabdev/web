"use client";

import { type RotationValidationState } from "./types";
import { ValidationIssues } from "./validation-issues";
import { ValidationNoSpec } from "./validation-no-spec";
import { ValidationOk } from "./validation-ok";
import { ValidationRunning } from "./validation-running";

type ValidationStripProps = {
  state: RotationValidationState;
};

export function ValidationStrip({ state }: Readonly<ValidationStripProps>) {
  switch (state.status) {
    case "errors": {
      return <ValidationIssues errors={state.errors} />;
    }

    case "idle": {
      return null;
    }

    case "no_spec": {
      return <ValidationNoSpec />;
    }

    case "ok": {
      return <ValidationOk warnings={state.warnings} />;
    }

    case "running": {
      return <ValidationRunning />;
    }
  }
}
