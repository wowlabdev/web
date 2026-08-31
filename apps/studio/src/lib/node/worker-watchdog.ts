export type WatchdogChunkMeta = {
  chunkIndex: number;
  iterations: number;
  jobId: string;
};

export type WatchdogTimeoutSnapshot = {
  chunkIndex: number;
  elapsedMs: number;
  iterations: number;
  jobId: string;
  lastBeatReason: string;
  silenceMs: number;
  timeoutMs: number;
};

type ActiveWatchdogState = {
  lastBeatAtMs: number;
  lastBeatReason: string;
  meta: WatchdogChunkMeta;
  startedAtMs: number;
};

export class WorkerWatchdog {
  private active: ActiveWatchdogState | null = null;
  private onTimeout: ((snapshot: WatchdogTimeoutSnapshot) => void) | null =
    null;

  private timeoutMs: number;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private token = 0;

  constructor(timeoutMs: number) {
    this.timeoutMs = timeoutMs;
  }

  beat(reason: string): void {
    if (!this.active) {
      return;
    }

    this.active.lastBeatAtMs = performance.now();
    this.active.lastBeatReason = reason;
    this.arm(this.token);
  }

  dispose(): void {
    this.finish();
  }

  finish(): void {
    this.clearTimer();
    this.active = null;
    this.onTimeout = null;
  }

  start(
    meta: WatchdogChunkMeta,
    onTimeout: (snapshot: WatchdogTimeoutSnapshot) => void,
  ): void {
    const now = performance.now();

    this.token += 1;
    this.onTimeout = onTimeout;
    this.active = {
      lastBeatAtMs: now,
      lastBeatReason: "start",
      meta,
      startedAtMs: now,
    };
    this.arm(this.token);
  }

  private arm(token: number): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      if (!this.active || token !== this.token || !this.onTimeout) {
        return;
      }

      const now = performance.now();
      const snapshot: WatchdogTimeoutSnapshot = {
        chunkIndex: this.active.meta.chunkIndex,
        elapsedMs: now - this.active.startedAtMs,
        iterations: this.active.meta.iterations,
        jobId: this.active.meta.jobId,
        lastBeatReason: this.active.lastBeatReason,
        silenceMs: now - this.active.lastBeatAtMs,
        timeoutMs: this.timeoutMs,
      };

      this.onTimeout(snapshot);
    }, this.timeoutMs);
  }

  private clearTimer(): void {
    if (!this.timer) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = null;
  }
}
