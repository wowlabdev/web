import { $ } from "zx";

const processes = [$`pnpm exec velite dev`, $`pnpm exec next dev --port 3000`];

try {
  await Promise.race(processes);
} finally {
  await Promise.allSettled(
    processes.map(async (process) => process.kill("SIGTERM")),
  );
  await Promise.allSettled(processes);
}
