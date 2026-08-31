import type { TailEnvironment } from "#types";

import { collectExceptions } from "#collect";
import { dataPoint } from "#schema";

const MAX_DATA_POINTS = 250;

export default {
  tail(events, environment) {
    let written = 0;

    for (const event of events) {
      for (const exception of collectExceptions(event)) {
        if (written >= MAX_DATA_POINTS) {
          return;
        }

        environment.ERRORS.writeDataPoint(dataPoint(exception));
        written += 1;
      }
    }
  },
} satisfies ExportedHandler<TailEnvironment>;
