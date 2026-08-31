"use client";

import type { TournamentView } from "wowlab-common";

import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { useCommon, WasmBoundary } from "@/components/shared/wasm";
import {
  buildBibExport,
  buildDropsExport,
  encodeResultExport,
} from "@/lib/parcel";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";
import { cn } from "@wowlab/shared/lib/utils";

type CopyToAddonButtonProps = {
  tournament: TournamentView;
  spec: string;
  jobId?: string;
  kind: Kind;
  className?: string;
};

type Kind = "bib" | "drops";

export function CopyToAddonButton(props: Readonly<CopyToAddonButtonProps>) {
  return (
    <WasmBoundary
      fallback={<Skeleton className={cn("h-8 w-28", props.className)} />}
    >
      <CopyToAddonButtonInner {...props} />
    </WasmBoundary>
  );
}

// V1 export ships item_id only; bonus_id_hash does not round-trip (addon resolves it by item id).
function CopyToAddonButtonInner({
  className,
  jobId,
  kind,
  spec,
  tournament,
}: Readonly<CopyToAddonButtonProps>) {
  const common = useCommon();
  const content = useIntlayer("resultsPage");
  const { copied, copy } = useClipboard();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);

    try {
      const payload =
        kind === "bib"
          ? buildBibExport({ jobId, spec, tournament })
          : buildDropsExport({ jobId, spec, tournament });
      const encoded = encodeResultExport(common, payload);

      await copy(encoded);
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : String(error_);

      setError(message);
    }
  };

  const resolveTooltip = () => {
    if (error) {
      return content.copyExportFailed({ message: error });
    }

    if (copied) {
      return content.copyPastedTooltip;
    }

    if (kind === "bib") {
      return content.copyBibTooltip;
    }

    return content.copyDropsTooltip;
  };
  const tooltip = resolveTooltip();

  const renderIcon = () => {
    if (copied) {
      return <CheckIcon className="size-4" />;
    }

    if (kind === "bib") {
      return <DownloadIcon className="size-4" />;
    }

    return <CopyIcon className="size-4" />;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          onClick={handleClick}
        >
          {renderIcon()}
          {kind === "bib" ? content.copyBibLabel : content.copyDropsLabel}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
