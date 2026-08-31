import { assertEquals, assertRejects } from "@std/assert";

import {
  assertPublicMcpUrl,
  createGuardedFetch,
  mcpAllowedHosts,
  type NetworkFetch,
} from "./network-policy.ts";

const ipv4 = (...octets: number[]) => octets.join(".");
const ipv6 = (...groups: string[]) => groups.join(":");
const PUBLIC_IPV4 = ipv4(93, 184, 216, 34);
const PUBLIC_IPV6 = ipv6(
  "2606",
  "2800",
  "220",
  "1",
  "248",
  "1893",
  "25c8",
  "1946",
);
const LOOPBACK_IPV4 = ipv4(127, 0, 0, 1);
const LINK_LOCAL_IPV4 = ipv4(169, 254, 169, 254);

Deno.test("network policy accepts allowlisted public endpoints", async () => {
  await assertPublicMcpUrl(new URL("https://mcp.example.com/rpc"), {
    allowedHosts: mcpAllowedHosts("mcp.example.com"),
    resolveHost: () => Promise.resolve([PUBLIC_IPV4, PUBLIC_IPV6]),
  });
});

Deno.test(
  "network policy accepts an allowlisted public IP literal",
  async () => {
    const endpoint = new URL(`https://${PUBLIC_IPV4}/rpc`);

    await assertPublicMcpUrl(endpoint, {
      allowedHosts: mcpAllowedHosts(endpoint.hostname),
      resolveHost: () =>
        Promise.reject(new Error("literal IP resolved as DNS")),
    });
  },
);

Deno.test("network policy rejects unapproved hosts", async () => {
  let resolved = false;

  await assertRejects(
    () =>
      assertPublicMcpUrl(new URL("https://evil.example/rpc"), {
        allowedHosts: mcpAllowedHosts("mcp.example.com"),
        resolveHost: () => {
          resolved = true;

          return Promise.resolve([PUBLIC_IPV4]);
        },
      }),
    TypeError,
    "not allowed",
  );
  assertEquals(resolved, false);
});

Deno.test("network policy rejects private and mixed DNS answers", async () => {
  for (const addresses of [
    [LOOPBACK_IPV4],
    [ipv4(10, 0, 0, 1)],
    [LINK_LOCAL_IPV4],
    [ipv6("", "", "1")],
    [ipv6("fc00", "", "1")],
    [ipv6("fe80", "", "1")],
    [PUBLIC_IPV4, ipv4(192, 168, 1, 1)],
  ]) {
    await assertRejects(
      () =>
        assertPublicMcpUrl(new URL("https://mcp.example.com/rpc"), {
          allowedHosts: mcpAllowedHosts("mcp.example.com"),
          resolveHost: () => Promise.resolve(addresses),
        }),
      TypeError,
      "public address",
    );
  }
});

Deno.test("network policy rejects unsafe endpoint syntax", async () => {
  const urls = [
    "http://mcp.example.com/rpc",
    "https://user:pass@mcp.example.com/rpc",
    "https://mcp.example.com:8443/rpc",
  ];

  for (const value of urls) {
    await assertRejects(
      () =>
        assertPublicMcpUrl(new URL(value), {
          allowedHosts: mcpAllowedHosts("mcp.example.com"),
          resolveHost: () => Promise.resolve([PUBLIC_IPV4]),
        }),
      TypeError,
    );
  }
});

Deno.test("network policy rejects private IP literals", async () => {
  const urls = [
    `https://${LOOPBACK_IPV4}/rpc`,
    "https://[::1]/rpc",
    "https://[::ffff:7f00:1]/rpc",
    "https://2130706433/rpc",
  ];

  for (const value of urls) {
    const endpoint = new URL(value);

    await assertRejects(
      () =>
        assertPublicMcpUrl(endpoint, {
          allowedHosts: mcpAllowedHosts(endpoint.hostname),
          resolveHost: () => Promise.resolve([PUBLIC_IPV4]),
        }),
      TypeError,
      "public address",
    );
  }
});

Deno.test("guarded fetch blocks redirects", async () => {
  let redirect: RequestRedirect | undefined;
  const fetchImpl: NetworkFetch = (_input, init) => {
    redirect = init?.redirect;

    return Promise.resolve(
      new Response(null, {
        headers: {
          Location: `http://${LINK_LOCAL_IPV4}/latest/meta-data`,
        },
        status: 302,
      }),
    );
  };
  const guardedFetch = createGuardedFetch(
    {
      allowedHosts: mcpAllowedHosts("mcp.example.com"),
      resolveHost: () => Promise.resolve([PUBLIC_IPV4]),
    },
    fetchImpl,
  );
  const response = await guardedFetch("https://mcp.example.com/rpc");

  assertEquals(redirect, "manual");
  assertEquals(response.status, 302);
});

Deno.test("guarded fetch resolves the host before every request", async () => {
  let requests = 0;
  let resolutions = 0;
  const guardedFetch = createGuardedFetch(
    {
      allowedHosts: mcpAllowedHosts("mcp.example.com"),
      resolveHost: () => {
        resolutions += 1;

        return Promise.resolve(
          resolutions === 1 ? [PUBLIC_IPV4] : [LOOPBACK_IPV4],
        );
      },
    },
    () => {
      requests += 1;

      return Promise.resolve(new Response(null, { status: 204 }));
    },
  );

  await guardedFetch("https://mcp.example.com/rpc");
  await assertRejects(
    () => guardedFetch("https://mcp.example.com/rpc"),
    TypeError,
    "public address",
  );
  assertEquals(resolutions, 2);
  assertEquals(requests, 1);
});
