import { env } from "@wowlab/shared/lib/env";
import { GITHUB_ORGANIZATION_URL } from "@wowlab/shared/lib/routing/external";
import { routes } from "@wowlab/shared/lib/routing/routes";
import { appUrl, href, landingUrl } from "@wowlab/shared/lib/routing/utils";

type CheckoutQuery = {
  discount?: string;
  plan?: "guild" | "individual";
  priceId: string;
  quantity: number;
};

type IconSize = "large" | "medium" | "small";

type OgImageQuery = {
  author?: string;
  date?: string;
  description: string;
  section: string;
  tag?: string;
  title?: string;
};

const ADDON_REPO_URL = `${GITHUB_ORGANIZATION_URL}/addon`;
const CORE_REPO_URL = `${GITHUB_ORGANIZATION_URL}/core`;
const WEB_REPO_URL = `${GITHUB_ORGANIZATION_URL}/web`;

export function makeAddonDownloadUrl(): string {
  return `https://www.curseforge.com/wow/addons/${env.CURSEFORGE_SLUG}`;
}

export function makeAddonInstallUrl(): string {
  return landingUrl("/go/addon-curseforge");
}

export function makeAddonRepoUrl(path: string = ""): string {
  return `${ADDON_REPO_URL}${path}`;
}

export function makeAssistantPromptsUrl(): string {
  return `${WEB_REPO_URL}/tree/main/apps/studio/src/components/core/rotations/editor/assistant/prompts`;
}

export function makeBenchReportUrl(): string {
  return "/benchmarks/report.html";
}

export function makeBillingSuccessUrl(): string {
  return appUrl(href(routes.account.billing.index), { ok: "1" });
}

export function makeBillingUrl(): string {
  return appUrl(href(routes.account.billing.index));
}

export function makeCdnImageUrl(
  src: string,
  opts: { quality?: number; width: number },
): string {
  const isLocal = src.startsWith("/");

  let inZone = isLocal;

  if (!isLocal) {
    try {
      const { hostname } = new URL(src);

      inZone =
        hostname === env.IMAGE_ZONE || hostname.endsWith(`.${env.IMAGE_ZONE}`);
    } catch {
      inZone = false;
    }
  }

  if (!inZone || process.env.NODE_ENV === "development") {
    return src;
  }

  const params = `width=${opts.width},quality=${opts.quality ?? 75},format=auto`;

  return `/cdn-cgi/image/${params}/${isLocal ? src.slice(1) : src}`;
}

export function makeCheckoutPath(opts: CheckoutQuery): string {
  const qs = new URLSearchParams(checkoutSearchParams(opts)).toString();

  return `${href(routes.account.billing.checkout)}?${qs}`;
}

export function makeCheckoutUrl(opts: CheckoutQuery): string {
  return appUrl(
    href(routes.account.billing.checkout),
    checkoutSearchParams(opts),
  );
}

export function makeContentSourceUrl(
  collection: string,
  sortKey: string,
): string {
  return `${WEB_REPO_URL}/blob/main/packages/shared/src/content/${collection}/${sortKey}.mdx`;
}

export function makeDungeonDataUrl(path: string): string {
  return `${env.SUPABASE_URL}/storage/v1/object/public/dungeon-data/${path.replace(
    /^\/+/,
    "",
  )}`;
}

export function makeDungeonTileUrl(
  expansion: string,
  dungeonKey: string,
  floor: number,
  zoom: number,
  x: number,
  y: number,
): string {
  return `${env.SUPABASE_URL}/storage/v1/object/public/dungeon-tiles/${expansion}/${dungeonKey}/${floor}/${zoom}/${x}_${y}.png`;
}

export function makeEncounterImageUrl(path: string): string {
  return `${env.SUPABASE_URL}/storage/v1/object/public/encounter-images/${path.replace(
    /^\/+/,
    "",
  )}`;
}

export function makeGitHubManifestUrl(slug: string): string {
  return `${CORE_REPO_URL}/blob/main/crates/engine/manifests/${slug}.toml`;
}

export function makeGitHubSearchUrl(query: string): string {
  return `${CORE_REPO_URL}/search?q=${encodeURIComponent(query)}&type=code`;
}

export function makeIconUrl(
  fileName: string,
  size: IconSize = "medium",
): string {
  return `${env.SUPABASE_URL}/functions/v1/icons/${size}/${fileName}.jpg`;
}

export function makeInspectItemUrl(itemId: number): string {
  return href(routes.inspect.item, { id: String(itemId) });
}

export function makeInspectSpellUrl(spellId: number): string {
  return href(routes.inspect.spell, { id: String(spellId) });
}

export function makeItemsReportUrl(spec: string): string {
  return `/benchmarks/items.html?spec=${encodeURIComponent(spec)}`;
}

export function makeOgImageUrl(opts: OgImageQuery): string {
  const params = new URLSearchParams({
    description: opts.description,
    section: opts.section,
  });

  if (opts.title !== undefined) {
    params.set("type", "article");
    params.set("title", opts.title);
  }

  if (opts.author) {
    params.set("author", opts.author);
  }

  if (opts.date) {
    params.set("date", opts.date);
  }

  if (opts.tag) {
    params.set("tag", opts.tag);
  }

  return `${env.OG_URL}/?${params.toString()}`;
}

export function makePricingUrl(): string {
  return landingUrl(href(routes.pricing));
}

export function makeRefundPolicyUrl(): string {
  return `${landingUrl(href(routes.about.terms))}#refund-policy`;
}

export function makeSignInUrl(opts?: { next?: string }): string {
  return appUrl(
    href(routes.auth.signIn),
    opts?.next ? { next: opts.next } : undefined,
  );
}

export function makeSimulateUrl(): string {
  return appUrl(href(routes.simulate.index));
}

export function makeTranslationsUrl(): string {
  return `${WEB_REPO_URL}/tree/main/packages/shared/src/i18n`;
}

export function makeWowheadItemUrl(itemId: number): string {
  return `https://www.wowhead.com/item=${itemId}`;
}

export function makeWowheadSpellUrl(spellId: number): string {
  return `https://www.wowhead.com/spell=${spellId}`;
}

function checkoutSearchParams(opts: CheckoutQuery): Record<string, string> {
  return {
    priceId: opts.priceId,
    quantity: String(opts.quantity),
    ...(opts.plan && { plan: opts.plan }),
    ...(opts.discount && { discount: opts.discount }),
  };
}
