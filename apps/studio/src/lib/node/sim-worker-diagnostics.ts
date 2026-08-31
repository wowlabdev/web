export function installWorkerDiagnostics(): void {
  self.addEventListener("error", (event) => {
    emitWorkerDiagnostic("wowlab:worker-error", {
      colno: event.colno,
      filename: event.filename,
      lineno: event.lineno,
      message: event.message,
      stack: event.error instanceof Error ? event.error.stack : undefined,
    });
  });

  self.addEventListener("unhandledrejection", (event) => {
    emitWorkerDiagnostic("wowlab:worker-unhandledrejection", {
      reason: stringifyUnknown(event.reason),
    });
  });

  self.addEventListener("messageerror", () => {
    emitWorkerDiagnostic("wowlab:worker-messageerror", {
      message: "Worker failed to deserialize an incoming message",
    });
  });
}

function emitWorkerDiagnostic(
  type:
    | "wowlab:worker-error"
    | "wowlab:worker-messageerror"
    | "wowlab:worker-unhandledrejection",
  payload: Record<string, unknown>,
): void {
  self.postMessage({ ...payload, type });
}

function stringifyUnknown(value: unknown): string {
  if (value instanceof Error) {
    const stack = value.stack ? ` stack=${value.stack}` : "";

    return `${value.name}: ${value.message}${stack}`;
  }

  return String(value);
}
