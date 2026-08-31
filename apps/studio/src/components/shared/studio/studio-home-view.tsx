"use client";

import {
  CheckCircle2Icon,
  CircleDashedIcon,
  PlayIcon,
  XCircleIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { SavedCharacter } from "@/lib/user-data";

import { GameSpec } from "@/components/shared/game";
import { getJobMeta, type JobRow, useRecentJobs } from "@/lib/query/services";
import { useSimulatorStore } from "@/lib/state";
import { useSavedCharacters } from "@/lib/user-data";
import { RelativeTime } from "@wowlab/shared/components/common/relative-time";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { href, routes, useLocalizedRouter } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";
type JobDisplayStatus = "completed" | "failed" | "queued" | "running";
const HOME_CHARACTER_LIMIT = 6;
const STATUS_META: Record<
  JobDisplayStatus,
  {
    icon: typeof CheckCircle2Icon;
    tone: string;
  }
> = {
  completed: {
    icon: CheckCircle2Icon,
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  failed: { icon: XCircleIcon, tone: "text-destructive" },
  queued: { icon: CircleDashedIcon, tone: "text-muted-foreground" },
  running: { icon: PlayIcon, tone: "text-sky-600 dark:text-sky-400" },
};

export function StudioHomeView() {
  const content = useIntlayer("studioHome");
  const router = useLocalizedRouter();
  const setSimcInput = useSimulatorStore((s) => s.setSimcInput);
  const { data: characters, isLoading: charactersLoading } =
    useSavedCharacters();
  const { data: jobs, isLoading: jobsLoading } = useRecentJobs();
  const recentCharacters = (characters ?? []).slice(0, HOME_CHARACTER_LIMIT);
  const recentJobs = jobs ?? [];
  const runningCount = recentJobs.filter(
    (job) => getJobMeta(job).status === "running",
  ).length;
  const statusLabels: Record<JobDisplayStatus, string> = {
    completed: content.statusDone.value,
    failed: content.statusFailed.value,
    queued: content.statusQueued.value,
    running: content.statusRunning.value,
  };
  const onSim = (character: SavedCharacter) => {
    const simc = character.snapshots.at(0)?.simc;

    if (!simc) {
      return;
    }

    setSimcInput(simc);
    router.push(href(routes.simulate.quick));
  };

  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-wrap items-end justify-between gap-3 pt-4 sm:pt-6">
        <div className="space-y-1" id="tour-welcome">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {content.welcomeBack}
          </h1>
          <p className="text-muted-foreground text-sm">
            {runningCount > 0
              ? content.runningCount(runningCount)
              : content.pickUp}
          </p>
        </div>
        <Button asChild id="tour-new-sim">
          <Link href={href(routes.simulate.quick)}>
            <PlayIcon className="size-4" />
            {content.newSim}
          </Link>
        </Button>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">{content.charactersTitle}</h2>
          <span className="text-muted-foreground text-xs">
            {content.charactersRecent({ count: recentCharacters.length })}
          </span>
        </div>
        {charactersLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton className="h-20 rounded-xl" key={index} />
            ))}
          </div>
        ) : null}
        {!charactersLoading && recentCharacters.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {content.emptyCharacters}
          </p>
        ) : null}
        {!charactersLoading && recentCharacters.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentCharacters.map((character) => (
              <Card className="overflow-hidden" key={character.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="truncate text-sm font-medium">
                      {character.name}
                    </div>
                    <GameSpec size="sm" specId={character.specId} />
                    <div className="text-muted-foreground text-xs">
                      {content.lastUsed}{" "}
                      <RelativeTime at={character.lastUsedAt} />
                    </div>
                  </div>
                  <Button
                    onClick={() => onSim(character)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <PlayIcon className="size-3.5" />
                    {content.sim}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">{content.recentSims}</h2>
          <Button asChild size="sm" variant="ghost">
            <Link href={href(routes.simulate.index)}>{content.viewAll}</Link>
          </Button>
        </div>
        {jobsLoading ? <Skeleton className="h-40 rounded-xl" /> : null}
        {!jobsLoading && recentJobs.length === 0 ? (
          <p className="text-muted-foreground text-sm">{content.emptySims}</p>
        ) : null}
        {!jobsLoading && recentJobs.length > 0 ? (
          <Card id="tour-recent-sims">
            <CardContent className="divide-y p-0">
              {recentJobs.map((job) => (
                <RecentJobRow
                  job={job}
                  key={job.id}
                  statusLabels={statusLabels}
                />
              ))}
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}

function RecentJobRow({
  job,
  statusLabels,
}: Readonly<{
  job: JobRow;
  statusLabels: Record<JobDisplayStatus, string>;
}>) {
  const meta = getJobMeta(job);
  const status = toDisplayStatus(meta.status);
  const statusMeta = STATUS_META[status];
  const StatusIcon = statusMeta.icon;

  return (
    <Link
      className="hover:bg-muted/40 flex items-center gap-4 px-4 py-3 transition-colors"
      href={href(routes.simulate.results, { id: job.id })}
    >
      {status === "running" ? (
        <LogoSpinner className="size-4 shrink-0" />
      ) : (
        <StatusIcon className={cn("size-4 shrink-0", statusMeta.tone)} />
      )}
      <div className="min-w-0 flex-1">
        {meta.spec_id > 0 ? (
          <GameSpec size="sm" specId={meta.spec_id} />
        ) : (
          <span className="text-muted-foreground text-sm">
            {statusLabels[status]}
          </span>
        )}
      </div>
      <div className="text-muted-foreground w-24 shrink-0 text-right text-xs">
        {meta.created_at ? <RelativeTime at={meta.created_at} /> : null}
      </div>
      <Badge className="hidden md:inline-flex" variant="outline">
        {statusLabels[status]}
      </Badge>
    </Link>
  );
}

function toDisplayStatus(status: string): JobDisplayStatus {
  switch (status) {
    case "cancelled":
    case "failed": {
      return "failed";
    }

    case "completed": {
      return "completed";
    }

    case "running": {
      return "running";
    }

    default: {
      return "queued";
    }
  }
}
