"use client";

import { Loading } from "@wowlab/shared/components/common/loading";
import { LoadingOverlay } from "@wowlab/shared/components/common/loading-overlay";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { LogoMark } from "@wowlab/shared/components/ui/logo-mark";
import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { cn } from "@wowlab/shared/lib/utils";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

const SIZES = [
  { className: "size-4", label: "16" },
  { className: "size-5", label: "20" },
  { className: "size-6", label: "24" },
  { className: "size-8", label: "32" },
  { className: "size-10", label: "40" },
  { className: "size-16", label: "64" },
  { className: "size-24", label: "96" },
] as const;

export function SpinnersSection() {
  return (
    <DemoSection id="spinners" title="Loading States">
      <p className="text-muted-foreground text-xs">
        Brand loading components from <code>@wowlab/shared</code>.
      </p>

      <SizesDemo />
      <TonesDemo />
      <LoadingBlockDemo />
      <InlineTextDemo />
      <ButtonsDemo />
      <IdleDisabledDemo />
      <PanelLoadingDemo />
      <OverlayDemo />
      <FullPageDemo />
      <OnSurfacesDemo />
    </DemoSection>
  );
}

function ButtonsDemo() {
  return (
    <DemoSubsection title="Button — loading prop">
      <DemoBox className="gap-3">
        <Button loading>Saving…</Button>
        <Button variant="secondary" loading>
          Loading…
        </Button>
        <Button variant="outline" loading>
          Refreshing…
        </Button>
        <Button variant="destructive" loading>
          Deleting…
        </Button>
        <Button size="sm" loading>
          Running
        </Button>
      </DemoBox>
    </DemoSubsection>
  );
}

function FullPageDemo() {
  return (
    <DemoSubsection title="Full-page / route loading">
      <DemoBox className="block">
        <Loading
          size="lg"
          label="Warming up the engine…"
          className="bg-background h-64 rounded-sm border"
        />
      </DemoBox>
    </DemoSubsection>
  );
}

function IdleDisabledDemo() {
  return (
    <DemoSubsection title="LogoMark — idle / disabled">
      <DemoBox className="gap-8">
        <div className="flex flex-col items-center gap-1">
          <LogoSpinner className="size-10" />
          <span className="text-muted-foreground text-[10px]">active</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <LogoMark className="size-10 opacity-40" />
          <span className="text-muted-foreground text-[10px]">
            idle (dimmed)
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <LogoMark className="size-10 opacity-30 grayscale" />
          <span className="text-muted-foreground text-[10px]">disabled</span>
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

function InlineTextDemo() {
  return (
    <DemoSubsection title="Inline in text">
      <DemoBox>
        <p className="text-sm">
          Syncing your character{" "}
          <LogoSpinner className="inline-block size-4 align-[-0.2em]" /> hang
          tight.
        </p>
      </DemoBox>
    </DemoSubsection>
  );
}

function LoadingBlockDemo() {
  return (
    <DemoSubsection title="Loading — centered block (sm / md / lg)">
      <DemoBox className="gap-4">
        <Loading size="sm" label="Loading…" className="flex-1" />
        <Loading size="md" label="Fetching results…" className="flex-1" />
        <Loading size="lg" label="Crunching simulations…" className="flex-1" />
      </DemoBox>
    </DemoSubsection>
  );
}

function OverlayDemo() {
  return (
    <DemoSubsection title="LoadingOverlay — refetching content">
      <DemoBox className="block">
        <LoadingOverlay
          loading
          label="Updating…"
          className="overflow-hidden rounded-sm border"
        >
          <div className="space-y-2 p-4" aria-hidden>
            <p className="text-sm font-medium">Top damage abilities</p>
            <p className="text-muted-foreground text-xs">
              Mutilate · Envenom · Rupture · Garrote · Sinister Strike
            </p>
            <p className="text-muted-foreground text-xs">
              Last updated a few seconds ago
            </p>
          </div>
        </LoadingOverlay>
      </DemoBox>
    </DemoSubsection>
  );
}

function PanelLoadingDemo() {
  return (
    <DemoSubsection title="Panel / section loading">
      <DemoBox className="block">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Simulation results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Loading className="h-40" label="Loading results…" />
          </CardContent>
        </Card>
      </DemoBox>
    </DemoSubsection>
  );
}

function SizesDemo() {
  return (
    <DemoSubsection title="LogoSpinner — sizes">
      <DemoBox className="gap-6">
        {SIZES.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <LogoSpinner className={s.className} />
            <span className="text-muted-foreground text-[10px]">
              {s.label}px
            </span>
          </div>
        ))}
      </DemoBox>
    </DemoSubsection>
  );
}

function TonesDemo() {
  return (
    <DemoSubsection title="LogoSpinner — tones">
      <DemoBox className="gap-8">
        <div className="flex flex-col items-center gap-1">
          <LogoSpinner className="size-10" tone="gradient" />
          <span className="text-muted-foreground text-[10px]">gradient</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <LogoSpinner className="size-10" tone="outline" />
          <span className="text-muted-foreground text-[10px]">outline</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <LogoSpinner className="size-10" tone="mono" />
          <span className="text-muted-foreground text-[10px]">mono</span>
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

const SURFACES = [
  { className: "bg-background text-foreground", label: "background" },
  { className: "bg-card text-card-foreground", label: "card" },
  { className: "bg-popover text-popover-foreground", label: "popover" },
  { className: "bg-muted text-muted-foreground", label: "muted" },
  { className: "bg-accent text-accent-foreground", label: "accent" },
  { className: "bg-secondary text-secondary-foreground", label: "secondary" },
  { className: "bg-sidebar text-sidebar-foreground", label: "sidebar" },
  { className: "bg-primary text-primary-foreground", label: "primary" },
  {
    className: "bg-foreground text-background",
    label: "foreground (inverted)",
  },
  {
    className: "bg-gradient-to-br from-muted to-card text-foreground",
    label: "muted → card",
  },
  {
    className:
      "bg-gradient-to-br from-primary to-accent text-primary-foreground",
    label: "primary → accent",
  },
  {
    className:
      "bg-card text-card-foreground bg-[radial-gradient(circle_at_30%_20%,var(--accent),transparent_60%)]",
    label: "radial accent",
  },
] as const;

function OnSurfacesDemo() {
  return (
    <DemoSubsection title="On different surfaces">
      <p className="text-muted-foreground -mt-1 text-xs">
        Theme tokens (adapt to light/dark), gradients, and the yellow primary —
        to check how the gradient mark reads everywhere.
      </p>
      <DemoBox className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SURFACES.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex h-24 flex-col items-center justify-center gap-2 rounded-md border",
              s.className,
            )}
          >
            <LogoSpinner className="size-9" />
            <span className="text-[10px] font-medium opacity-70">
              {s.label}
            </span>
          </div>
        ))}
      </DemoBox>
    </DemoSubsection>
  );
}
