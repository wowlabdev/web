export function formatError(error: unknown): string {
  if (error instanceof Error) {
    const stack = error.stack ? ` | stack=${error.stack}` : "";

    return `${error.name}: ${error.message}${stack}`;
  }

  return String(error);
}
