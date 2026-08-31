import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AssistantCode } from "./assistant-code";

vi.mock("@wowlab/shared/components/common/copy-button", () => ({
  CopyButton: () => null,
}));

afterEach(cleanup);

describe("AssistantCode", () => {
  it.each([
    ["lua", "local value = true"],
    ["toml", 'name = "value"'],
  ])("highlights %s code", async (language, code) => {
    const { container } = render(
      <AssistantCode code={code} language={language} />,
    );

    await waitFor(() => {
      expect(container.querySelector(".shiki span[style]")).not.toBeNull();
    });
  });

  it("renders unsupported languages as plain text", async () => {
    const { container } = render(
      <AssistantCode code="unknown code" language="not-a-language" />,
    );

    await waitFor(() => {
      const line = container.querySelector(".shiki .line");

      expect(line?.textContent).toBe("unknown code");
      expect(line?.querySelector("span")?.hasAttribute("style")).toBe(false);
    });
  });
});
