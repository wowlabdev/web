import ipaddr from "ipaddr.js";

const ALLOWED_PORT = "443";

export type HostResolver = (hostname: string) => Promise<string[]>;
export type McpNetworkPolicy = {
  allowedHosts: ReadonlySet<string>;
  resolveHost: HostResolver;
};

export type NetworkFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export async function assertPublicMcpUrl(
  url: URL,
  policy: McpNetworkPolicy,
): Promise<void> {
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== ALLOWED_PORT)
  ) {
    throw new TypeError("MCP endpoints must use HTTPS on port 443.");
  }

  const hostname = normalizeHostname(url.hostname);

  if (!hostname || !policy.allowedHosts.has(hostname)) {
    throw new TypeError("MCP endpoint host is not allowed.");
  }

  const addresses = ipaddr.isValid(hostname)
    ? [hostname]
    : await policy.resolveHost(hostname);

  if (
    addresses.length === 0 ||
    addresses.some((address) => !isPublicIp(address))
  ) {
    throw new TypeError("MCP endpoint does not resolve to a public address.");
  }
}

export function createGuardedFetch(
  policy: McpNetworkPolicy,
  fetchImpl: NetworkFetch = fetch,
): NetworkFetch {
  return async (input, init) => {
    const request = new Request(input, init);

    await assertPublicMcpUrl(new URL(request.url), policy);

    return fetchImpl(request, { redirect: "manual" });
  };
}

export function mcpAllowedHosts(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((host) => normalizeHostname(host))
      .filter(Boolean),
  );
}

export async function resolveDnsAddresses(hostname: string): Promise<string[]> {
  const results = await Promise.allSettled([
    Deno.resolveDns(hostname, "A"),
    Deno.resolveDns(hostname, "AAAA"),
  ]);
  const addresses = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  if (addresses.length === 0) {
    throw new TypeError("MCP endpoint DNS lookup failed.");
  }

  return [...new Set(addresses)];
}

function isPublicIp(value: string): boolean {
  if (!ipaddr.isValid(value)) {
    return false;
  }

  if (ipaddr.IPv6.isValid(value)) {
    const address = ipaddr.IPv6.parse(value);

    return address.isIPv4MappedAddress()
      ? address.toIPv4Address().range() === "unicast"
      : address.range() === "unicast";
  }

  return ipaddr.IPv4.parse(value).range() === "unicast";
}

function normalizeHostname(value: string): string {
  let hostname = value.trim().toLowerCase();

  if (hostname.startsWith("[") && hostname.endsWith("]")) {
    hostname = hostname.slice(1, -1);
  }

  while (hostname.endsWith(".")) {
    hostname = hostname.slice(0, -1);
  }

  return hostname;
}
