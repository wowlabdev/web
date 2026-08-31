import { describe, expect, it } from "vitest";

import { createDeploymentMetadata } from "./metadata.ts";

describe("deployment metadata", () => {
  it("identifies the source and workflow run", () => {
    const metadata = createDeploymentMetadata("studio", "dev", {
      branch: "feature/cloudflare",
      repository: "wowlabdev/web",
      runId: "1234",
      sha: "0123456789abcdef0123456789abcdef01234567",
    });

    expect(metadata).toEqual({
      message: "https://github.com/wowlabdev/web/actions/runs/1234",
      publicEnvironment: {
        NEXT_PUBLIC_DEPLOYMENT_SHA: "0123456789abcdef0123456789abcdef01234567",
        NEXT_PUBLIC_DEPLOYMENT_URL:
          "https://github.com/wowlabdev/web/actions/runs/1234",
      },
      tag: "feature-cloudflare-dev-studio-0123456789ab",
    });
    expect(metadata.message).toMatch(/^[a-zA-Z0-9_./:@-]+$/);
    expect(metadata.tag.length).toBeLessThanOrEqual(100);
  });

  it("omits workflow-run details outside GitHub Actions", () => {
    const metadata = createDeploymentMetadata("landing", "prod", {
      branch: "main",
      repository: "wowlabdev/web",
      sha: "fedcba9876543210",
    });

    expect(metadata).toEqual({
      message: "wowlabdev/web@fedcba9876543210",
      publicEnvironment: {
        NEXT_PUBLIC_DEPLOYMENT_SHA: "fedcba9876543210",
        NEXT_PUBLIC_DEPLOYMENT_URL:
          "https://github.com/wowlabdev/web/commit/fedcba9876543210",
      },
      tag: "main-prod-landing-fedcba987654",
    });
  });

  it("keeps tags within Wrangler's limit", () => {
    const metadata = createDeploymentMetadata("og", "dev", {
      branch: `feature/${"cloudflare".repeat(20)}`,
      repository: "wowlabdev/web",
      sha: "0123456789abcdef",
    });

    expect(metadata.tag).toMatch(/^[a-zA-Z0-9._-]+$/);
    expect(metadata.tag.length).toBeLessThanOrEqual(100);
  });
});
