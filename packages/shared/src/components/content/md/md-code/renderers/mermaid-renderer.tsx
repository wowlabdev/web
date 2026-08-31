"use client";

import { useAsyncEffect } from "ahooks";
import mermaid from "mermaid";
import { useIntlayer } from "next-intlayer";
import { useTheme } from "next-themes";
import { useId, useMemo, useRef, useState } from "react";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { LightboxTrigger } from "@wowlab/shared/components/ui/lightbox";

type MermaidRendererProps = {
  code: string;
};

export function MermaidRenderer({ code }: Readonly<MermaidRendererProps>) {
  const { mermaid: content } = useIntlayer("article");
  const id = useId();
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const renderCountRef = useRef(0);

  const isDark = resolvedTheme === "dark";
  const cleanCode = code.trim();

  useAsyncEffect(async () => {
    const renderCount = ++renderCountRef.current;
    const renderId = `mermaid-${id.replaceAll(":", "")}-${renderCount}`;

    initializeMermaid(isDark);

    try {
      const { svg } = await mermaid.render(renderId, cleanCode);

      if (renderCount !== renderCountRef.current) {
        return;
      }

      setSvg(svg);
      setError(null);
    } catch (error_) {
      if (renderCount !== renderCountRef.current) {
        return;
      }

      setError(
        error_ instanceof Error ? error_.message : content.renderFailed.value,
      );
    }
  }, [id, cleanCode, isDark]);

  const src = useMemo(() => (svg ? svgToImageSrc(svg) : undefined), [svg]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{content.diagramError}</AlertTitle>
        <AlertDescription>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">
            {error}
          </pre>
        </AlertDescription>
      </Alert>
    );
  }

  if (!svg) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <LightboxTrigger
      variant="diagram"
      title={content.diagram.value}
      src={src}
      initialZoom={3}
    >
      <div
        className="flex justify-center font-mono [&_svg]:max-w-full [&_svg]:h-auto"
        // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- mermaid sanitizes its own output (securityLevel "strict")
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </LightboxTrigger>
  );
}

function initializeMermaid(isDark: boolean) {
  mermaid.initialize({
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 14,
    securityLevel: "strict",
    startOnLoad: false,
    theme: isDark ? "dark" : "default",
  });
}

function svgToImageSrc(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
