import type { WorkerSlot } from "./worker-slot";

type DiagnosticHandlers = {
  isTracked: (slot: WorkerSlot) => boolean;
  onFatal: (message: string, cause?: unknown) => void;
  onSlotError: (slot: WorkerSlot) => void;
};

type DiagnosticRecord = Record<string, unknown>;

export function attachWorkerDiagnostics(
  slot: WorkerSlot,
  handlers: DiagnosticHandlers,
): void {
  const { isTracked, onFatal, onSlotError } = handlers;

  slot.worker.addEventListener("message", (event: MessageEvent<unknown>) => {
    if (!isTracked(slot)) {
      return;
    }

    const detail = parseWorkerDiagnosticMessage(slot.id, event.data);

    if (detail === null) {
      return;
    }

    onSlotError(slot);
    onFatal(detail);
  });

  slot.worker.addEventListener("error", (event) => {
    if (!isTracked(slot)) {
      return;
    }

    onSlotError(slot);
    onFatal(describeWorkerRuntimeError(slot, event), event.error);
  });

  slot.worker.addEventListener("messageerror", (event) => {
    if (!isTracked(slot)) {
      return;
    }

    onSlotError(slot);
    onFatal(describeWorkerMessageError(slot.id), event);
  });
}

export function describeExecutionError(err: unknown): string {
  if (err instanceof Error) {
    const stack = err.stack ? ` stack=${err.stack}` : "";

    return `${err.name}: ${err.message}${stack}`;
  }

  return String(err);
}

export function describeWorkerMessageError(slotId: string): string {
  return `[${slotId}] Worker messageerror: failed to deserialize worker message`;
}

export function describeWorkerRuntimeError(
  slot: WorkerSlot,
  event: ErrorEvent,
): string {
  return [
    `Worker runtime error [${slot.id}]`,
    event.message ? `message=${event.message}` : null,
    event.filename ? `file=${event.filename}` : null,
    event.lineno > 0 ? `line=${event.lineno}` : null,
    event.colno > 0 ? `col=${event.colno}` : null,
    slot.lastMetrics.currentPhase
      ? `phase=${slot.lastMetrics.currentPhase}`
      : null,
    slot.lastMetrics.currentJobId
      ? `job=${slot.lastMetrics.currentJobId}`
      : null,
    slot.lastMetrics.currentIterations == null
      ? null
      : `iterations=${slot.lastMetrics.currentIterations}`,
  ]
    .filter(Boolean)
    .join(" | ");
}

function formatEnginePanic(slotId: string, record: DiagnosticRecord): string {
  const panicMessage =
    typeof record.message === "string"
      ? record.message
      : JSON.stringify(record.message);

  return `[${slotId}] Engine panic: ${panicMessage}`;
}

function formatMessageError(slotId: string, record: DiagnosticRecord): string {
  const message =
    typeof record.message === "string" ? record.message : "Worker messageerror";

  return `[${slotId}] ${message}`;
}

function formatUnhandledRejection(
  slotId: string,
  record: DiagnosticRecord,
): string {
  const reason =
    typeof record.reason === "string"
      ? record.reason
      : JSON.stringify(record.reason);

  return `[${slotId}] Worker unhandled rejection: ${reason}`;
}

function formatWorkerError(slotId: string, record: DiagnosticRecord): string {
  const workerErrorBits = [
    typeof record.message === "string" ? `message=${record.message}` : null,
    typeof record.filename === "string" ? `file=${record.filename}` : null,
    typeof record.lineno === "number" ? `line=${record.lineno}` : null,
    typeof record.colno === "number" ? `col=${record.colno}` : null,
    typeof record.stack === "string" ? `stack=${record.stack}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return `[${slotId}] Worker internal error: ${workerErrorBits}`;
}

const DIAGNOSTIC_FORMATTERS: Record<
  string,
  (slotId: string, record: DiagnosticRecord) => string
> = {
  "wowlab:engine-panic": formatEnginePanic,
  "wowlab:worker-error": formatWorkerError,
  "wowlab:worker-messageerror": formatMessageError,
  "wowlab:worker-unhandledrejection": formatUnhandledRejection,
};

export function parseWorkerDiagnosticMessage(
  slotId: string,
  data: unknown,
): null | string {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as DiagnosticRecord;
  const formatter =
    typeof record.type === "string"
      ? DIAGNOSTIC_FORMATTERS[record.type]
      : undefined;

  return formatter ? formatter(slotId, record) : null;
}
