import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { getOctokit, GITHUB_REPO, parseRepo } from "@/lib/github/client";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

const getRoadmap = unstable_cache(
  async () => {
    const octokit = getOctokit();
    const { owner, repo } = parseRepo(GITHUB_REPO);

    const [issuesResponse, milestonesResponse] = await Promise.all([
      octokit.rest.issues.listForRepo({
        direction: "desc",
        labels: "roadmap",
        owner,
        per_page: 100,
        repo,
        sort: "updated",
        state: "all",
      }),
      octokit.rest.issues.listMilestones({
        direction: "asc",
        owner,
        per_page: 100,
        repo,
        sort: "due_on",
        state: "all",
      }),
    ]);

    return {
      issues: issuesResponse.data.filter((issue) => !issue.pull_request),
      milestones: milestonesResponse.data,
    };
  },
  ["github-roadmap"],
  { revalidate: 300 },
);

export async function GET() {
  try {
    return NextResponse.json(await getRoadmap());
  } catch {
    return apiError(Status.BadGateway, "Failed to fetch roadmap");
  }
}
