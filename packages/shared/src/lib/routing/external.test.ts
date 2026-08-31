import { describe, expect, it } from "vitest";

import { isExternalUrl } from "./external";

const CURRENT_ORIGIN = "https://wowlab.gg";

describe("external URLs", () => {
  it.each([
    "https://wowlab.gg/pricing",
    "https://github.com/wowlabdev",
    "https://github.com/wowlabdev/web/actions/runs/1234",
  ])("trusts %s", (url) => {
    expect(isExternalUrl(new URL(url), CURRENT_ORIGIN)).toBe(false);
  });

  it.each([
    "https://example.com",
    "https://github.com/another-organization",
    "https://github.com/wowlabdev-fake",
  ])("warns for %s", (url) => {
    expect(isExternalUrl(new URL(url), CURRENT_ORIGIN)).toBe(true);
  });
});
