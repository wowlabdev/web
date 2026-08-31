import { CustomFont, ImageResponse } from "@cf-wasm/og/workerd";

const SIZE = { height: 630, width: 1200 };

const GRADIENTS = {
  accent:
    "linear-gradient(90deg, rgba(251, 191, 36, 0.95) 0%, rgba(56, 189, 248, 0.9) 100%)",
  background:
    "radial-gradient(circle at top left, rgba(251, 191, 36, 0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.14), transparent 60%), linear-gradient(170deg, #14161f 0%, #0e1018 50%, #0b0d12 100%)",
} as const;

const accentBarStyle = {
  background: GRADIENTS.accent,
  height: "5px",
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
} as const;

const baseContainerStyle = {
  background: GRADIENTS.background,
  color: "#edf2fb",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Geist",
  height: "100%",
  letterSpacing: "-0.015em",
  position: "relative",
  width: "100%",
} as const;

export type OgEnv = {
  ASSETS: { fetch(input: URL): Promise<Response> };
  OG_BUCKET: R2Bucket;
  OG_RATE_LIMITER: RateLimit;
};

export type OgInput = (
  | {
      author?: string;
      date?: string;
      tag?: string;
      title: string;
      type: "article";
    }
  | { type: "section" }
) &
  OgBase;

type CardProps = { logo: string } & Omit<
  Extract<OgInput, { type: "article" }>,
  "type"
>;

type OgAssets = {
  geist400: ArrayBuffer;
  geist700: ArrayBuffer;
  logoSrc: string;
};

type OgBase = {
  description: string;
  section: string;
};

let assetsCache: Promise<OgAssets> | undefined;

export async function renderOgImage(
  env: OgEnv,
  input: OgInput,
): Promise<ArrayBuffer> {
  const { geist400, geist700, logoSrc } = await loadAssets(env);
  const fonts = buildFonts(geist400, geist700);
  const element =
    input.type === "article" ? (
      <ArticleCard {...input} logo={logoSrc} />
    ) : (
      <SectionCard
        description={input.description}
        logo={logoSrc}
        section={input.section}
      />
    );
  const image = await ImageResponse.async(element, { ...SIZE, fonts });

  return image.arrayBuffer();
}

function ArticleCard({
  author,
  date,
  description,
  logo,
  section,
  tag,
  title,
}: Readonly<CardProps>) {
  return (
    <div style={{ ...baseContainerStyle, fontSize: 32, padding: "48px 64px" }}>
      <div style={accentBarStyle} />
      <div
        style={{
          border: "1px solid rgba(206, 216, 231, 0.25)",
          inset: 24,
          position: "absolute",
        }}
      />

      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "14px",
          marginBottom: "40px",
        }}
      >
        <img src={logo} width={40} height={40} alt="" />
        <div style={{ color: "#fbbf24", fontSize: 24, fontWeight: 700 }}>
          WoW Lab
        </div>
        <div style={{ color: "#72849c", fontSize: 24 }}>/</div>
        <div style={{ color: "#d8e3f2", fontSize: 24 }}>{section}</div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: "24px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "0.01em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#b8c5d8",
            fontSize: 32,
            lineHeight: 1.3,
            wordSpacing: "-0.05em",
          }}
        >
          {description}
        </div>
      </div>

      {(author || date || tag) && (
        <div
          style={{
            alignItems: "center",
            color: "#b8c5d8",
            display: "flex",
            fontSize: 24,
          }}
        >
          {author && <span style={{ color: "#fbbf24" }}>{author}</span>}
          {author && date && <span style={{ margin: "0 12px" }}>/</span>}
          {date && <span>{date}</span>}
          {tag && (
            <>
              <span style={{ margin: "0 12px" }}>/</span>
              <span style={{ color: "#72849c" }}>#{tag}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function buildFonts(
  geist400: ArrayBuffer,
  geist700: ArrayBuffer,
): CustomFont[] {
  return [
    new CustomFont("Geist", geist400.slice(0), {
      style: "normal",
      weight: 400,
    }),
    new CustomFont("Geist", geist700.slice(0), {
      style: "normal",
      weight: 700,
    }),
  ];
}

function encodeBase64(buffer: ArrayBuffer): string {
  let binary = "";

  for (const byte of new Uint8Array(buffer)) {
    binary += String.fromCodePoint(byte);
  }

  return btoa(binary);
}

async function fetchAssets(env: OgEnv): Promise<OgAssets> {
  const [geist400, geist700, logo] = await Promise.all([
    readAsset(env, "/Geist-400.woff"),
    readAsset(env, "/Geist-700.woff"),
    readAsset(env, "/logo.png"),
  ]);

  return {
    geist400,
    geist700,
    logoSrc: `data:image/png;base64,${encodeBase64(logo)}`,
  };
}

function loadAssets(env: OgEnv): Promise<OgAssets> {
  assetsCache ??= fetchAssets(env).catch((error: unknown) => {
    assetsCache = undefined;
    throw error;
  });

  return assetsCache;
}

async function readAsset(env: OgEnv, path: string): Promise<ArrayBuffer> {
  const response = await env.ASSETS.fetch(
    new URL(path, "https://assets.local"),
  );

  if (!response.ok) {
    throw new Error(`Failed to load OG asset ${path}: ${response.status}`);
  }

  return response.arrayBuffer();
}

function SectionCard({
  description,
  logo,
  section,
}: Readonly<Pick<CardProps, "description" | "logo" | "section">>) {
  return (
    <div
      style={{
        ...baseContainerStyle,
        alignItems: "center",
        fontSize: 32,
        gap: "32px",
        justifyContent: "center",
      }}
    >
      <div style={accentBarStyle} />
      <div
        style={{
          border: "1px solid rgba(206, 216, 231, 0.25)",
          inset: 24,
          position: "absolute",
        }}
      />

      <img src={logo} width={96} height={96} alt="" />

      <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
        <div style={{ color: "#fbbf24", fontSize: 48, fontWeight: 700 }}>
          WoW Lab
        </div>
        <div style={{ color: "#72849c", fontSize: 48 }}>/</div>
        <div style={{ fontSize: 48, fontWeight: 700 }}>{section}</div>
      </div>

      <div style={{ color: "#b8c5d8", fontSize: 26, wordSpacing: "-0.05em" }}>
        {description}
      </div>
    </div>
  );
}
