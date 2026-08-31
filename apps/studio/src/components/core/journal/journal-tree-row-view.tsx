"use client";

import { type LucideIcon, Shield, Swords } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { SafeImage } from "@wowlab/shared/components/common/safe-image";
import { Button } from "@wowlab/shared/components/ui/button";
import { cn } from "@wowlab/shared/lib/utils";

import type { JournalTreeRow } from "./journal-tree-model";
import type { JournalEncounter, JournalSource } from "./types";

import { instanceMediaPath, publicJournalMediaUrl } from "./journal-media";

type EncounterRowProps = {
  encounter: JournalEncounter;
  isLastEncounter: boolean;
  isSelected: boolean;
  onSelect: (source: JournalSource, encounter: JournalEncounter) => void;
  source: JournalSource;
};

type JournalTreeAvatarProps = {
  alt: string;
  fallbackIcon?: LucideIcon;
  size: number;
  src: null | string;
};

type JournalTreeRowViewProps = {
  onEncounterSelect: (
    source: JournalSource,
    encounter: JournalEncounter,
  ) => void;
  onSourceSelect: (source: JournalSource) => void;
  row: JournalTreeRow;
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
};

type SourceRowProps = {
  isSelected: boolean;
  onSelect: (source: JournalSource) => void;
  source: JournalSource;
};

type TierRowProps = { count: number; name: string };

export function JournalTreeRowView({
  onEncounterSelect,
  onSourceSelect,
  row,
  selectedEncounter,
  selectedSource,
}: Readonly<JournalTreeRowViewProps>) {
  switch (row.kind) {
    case "encounter": {
      return (
        <EncounterRow
          encounter={row.encounter}
          isLastEncounter={row.isLastEncounter}
          isSelected={
            row.source.id === selectedSource.id &&
            row.encounter.id === selectedEncounter.id
          }
          onSelect={onEncounterSelect}
          source={row.source}
        />
      );
    }

    case "source": {
      return (
        <SourceRow
          isSelected={row.source.id === selectedSource.id}
          onSelect={onSourceSelect}
          source={row.source}
        />
      );
    }

    case "tier": {
      return <TierRow count={row.count} name={row.name} />;
    }
  }
}

function EncounterRow({
  encounter,
  isLastEncounter,
  isSelected,
  onSelect,
  source,
}: Readonly<EncounterRowProps>) {
  const src = publicJournalMediaUrl(encounter.imageStoragePath);

  return (
    <li role="none">
      <Button
        aria-current={isSelected ? "true" : undefined}
        className={cn(
          "h-[38px] w-full justify-start gap-2 border-x border-t px-2 text-xs font-normal aria-[current=true]:bg-primary/10 aria-[current=true]:border-primary/40",
          isLastEncounter && "border-b",
        )}
        data-last={isLastEncounter || undefined}
        onClick={() => onSelect(source, encounter)}
        variant="ghost"
      >
        <JournalTreeAvatar alt="" size={24} src={src} />
        <span className="truncate">{encounter.name}</span>
      </Button>
    </li>
  );
}

function JournalTreeAvatar({
  alt,
  fallbackIcon: FallbackIcon,
  size,
  src,
}: Readonly<JournalTreeAvatarProps>) {
  const boxClass = "shrink-0 border bg-muted object-cover";
  const dimensions = { height: size, width: size };
  const fallback = FallbackIcon ? (
    <span
      className="flex shrink-0 items-center justify-center border bg-muted"
      style={dimensions}
    >
      <FallbackIcon className="size-4" />
    </span>
  ) : null;

  return (
    <SafeImage
      alt={alt}
      className={boxClass}
      fallback={fallback}
      height={size}
      src={src}
      width={size}
    />
  );
}

function SourceRow({ isSelected, onSelect, source }: Readonly<SourceRowProps>) {
  const content = useIntlayer("journalPage");
  const FallbackIcon = source.kind === "raid" ? Swords : Shield;
  const src = publicJournalMediaUrl(instanceMediaPath(source));

  return (
    <li role="none">
      <Button
        aria-current={isSelected ? "true" : undefined}
        className={cn(
          "h-[42px] w-full justify-start gap-2 border bg-muted/20 px-2 hover:bg-muted/30 aria-[current=true]:bg-primary/5",
          source.isCurrentSeason &&
            "border-amber-400/80 shadow-[0_0_0_1px_rgba(251,191,36,0.18)]",
        )}
        onClick={() => onSelect(source)}
        variant="ghost"
      >
        <JournalTreeAvatar
          alt=""
          fallbackIcon={FallbackIcon}
          size={28}
          src={src}
        />
        <span className="min-w-0 flex-1 truncate font-medium">
          {source.name}
        </span>
        {source.isCurrentSeason ? (
          <span className="shrink-0 text-xs text-amber-300">
            {content.currentBadge}
          </span>
        ) : null}
      </Button>
    </li>
  );
}

function TierRow({ count, name }: Readonly<TierRowProps>) {
  return (
    <li role="presentation">
      <div className="flex h-[30px] items-center justify-between gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <span>{name}</span>
        <span>{count}</span>
      </div>
    </li>
  );
}
