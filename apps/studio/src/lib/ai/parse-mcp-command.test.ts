import { describe, expect, it } from "vitest";

import { parseMcpAddCommand } from "./parse-mcp-command";

describe("parseMcpAddCommand", () => {
  it("parses a claude mcp add command with an auth header", () => {
    expect(
      parseMcpAddCommand(
        'claude mcp add --transport http wowlab https://example.com/mcp --header "Authorization: Bearer abc123"',
      ),
    ).toEqual({
      headerName: "Authorization",
      headerValue: "Bearer abc123",
      label: "wowlab",
      url: "https://example.com/mcp",
    });
  });

  it("parses a gemini mcp add command", () => {
    expect(
      parseMcpAddCommand(
        "gemini mcp add --transport http my-server https://example.com/mcp",
      ),
    ).toEqual({ label: "my-server", url: "https://example.com/mcp" });
  });

  it("parses bare positional args without the mcp add prefix", () => {
    expect(parseMcpAddCommand("my-server https://example.com/mcp")).toEqual({
      label: "my-server",
      url: "https://example.com/mcp",
    });
  });

  it("parses a JSON config block", () => {
    expect(
      parseMcpAddCommand(
        JSON.stringify({
          mcpServers: {
            wowlab: {
              headers: { Authorization: "Bearer xyz" },
              type: "http",
              url: "https://example.com/mcp",
            },
          },
        }),
      ),
    ).toEqual({
      headerName: "Authorization",
      headerValue: "Bearer xyz",
      label: "wowlab",
      url: "https://example.com/mcp",
    });
  });

  it("reads alternative json url + header keys", () => {
    expect(
      parseMcpAddCommand(
        JSON.stringify({
          servers: {
            s: { http_headers: { "X-Key": "tok" }, serverUrl: "https://x/mcp" },
          },
        }),
      ),
    ).toEqual({
      headerName: "X-Key",
      headerValue: "tok",
      label: "s",
      url: "https://x/mcp",
    });
  });

  it("drops a header with no value", () => {
    expect(
      parseMcpAddCommand("claude mcp add wowlab https://example.com/mcp"),
    ).toEqual({ label: "wowlab", url: "https://example.com/mcp" });
  });

  it("returns null for empty or unusable input", () => {
    expect(parseMcpAddCommand("")).toBeNull();
    expect(parseMcpAddCommand("   ")).toBeNull();
    expect(parseMcpAddCommand("claude mcp add only-one-positional")).toBeNull();
    expect(parseMcpAddCommand("{ not json")).toBeNull();
  });
});
