import "server-only";

export type AuthedClientConfig = {
  baseUrl: string;
  auth: { headerName: string; value: string };
  errorLabel: string;
};

export async function authedFetch<T>(
  config: AuthedClientConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  headers.set(config.auth.headerName, config.auth.value);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`${config.errorLabel} ${response.status}: ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  return (text ? JSON.parse(text) : undefined) as T;
}
