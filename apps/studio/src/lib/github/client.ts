import { Octokit } from "@octokit/rest";

export const GITHUB_REPO = "wowlabdev/core";

let instance: Octokit | undefined;

export function getOctokit(): Octokit {
  if (!instance) {
    instance = new Octokit({
      auth: process.env.GITHUB_PAT,
      userAgent: "wowlab-web",
    });
  }

  return instance;
}

export function parseRepo(repo: string): { owner: string; repo: string } {
  const [owner, name] = repo.split("/");

  if (!owner || !name) {
    throw new Error(`Invalid repository format: ${repo}`);
  }

  return { owner, repo: name };
}
