import { ConsoleTransport, LogLayer } from "loglayer";
import { serializeError } from "serialize-error";

export const log = new LogLayer({
  errorSerializer: serializeError,
  transport: [
    new ConsoleTransport({
      levelField: "level",
      logger: console,
      messageField: "message",
    }),
  ],
});
