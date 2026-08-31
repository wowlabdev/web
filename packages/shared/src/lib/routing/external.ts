export const GITHUB_ORGANIZATION_URL = "https://github.com/wowlabdev";

export function isExternalUrl(url: URL, currentOrigin: string): boolean {
  return url.origin !== currentOrigin && !isGitHubOrganizationUrl(url);
}

function isGitHubOrganizationUrl(url: URL): boolean {
  const organization = new URL(GITHUB_ORGANIZATION_URL);

  return (
    url.origin === organization.origin &&
    (url.pathname === organization.pathname ||
      url.pathname.startsWith(`${organization.pathname}/`))
  );
}
