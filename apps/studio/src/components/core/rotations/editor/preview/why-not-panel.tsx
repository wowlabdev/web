"use client";

import type {
  ActionEvaluation,
  EvaluationStatus,
  IterationTrace,
} from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { cn } from "@wowlab/shared/lib/utils";

import type { SelectionFocus } from "../store-types";

import { walkDecisions } from "./walk-decisions";

type Cell = {
  evaluation: ActionEvaluation | null;
  status: EvaluationStatus | null;
  timeMs: number;
};

type WhyNotPanelProps = {
  selectionFocus: SelectionFocus | null;
  trace: IterationTrace | null;
};

const STATUS_BG: Record<EvaluationStatus, string> = {
  disabled: "bg-red-500/70 hover:bg-red-500",
  executed: "bg-sky-500/70 hover:bg-sky-500",
  fired: "bg-emerald-500/70 hover:bg-emerald-500",
  not_reached: "bg-muted-foreground/40 hover:bg-muted-foreground/60",
  rejected: "bg-yellow-500/70 hover:bg-yellow-500",
};

const ABSENT_BG = "bg-slate-500/30 hover:bg-slate-500/50";

type WhyNotCellProps = {
  absentLabel: string;
  ariaLabel: (timeMs: number, status: string) => string;
  cell: Cell;
  statusLabel: Record<EvaluationStatus, string>;
};

export function WhyNotPanel({
  selectionFocus,
  trace,
}: Readonly<WhyNotPanelProps>) {
  const content = useIntlayer("rotationEditor");

  const statusLabel: Record<EvaluationStatus, string> = useMemo(
    () => ({
      disabled: content.whyNotStatusDisabled.value,
      executed: content.whyNotStatusExecuted.value,
      fired: content.whyNotStatusFired.value,
      not_reached: content.whyNotStatusNotReached.value,
      rejected: content.whyNotStatusRejected.value,
    }),
    [
      content.whyNotStatusDisabled,
      content.whyNotStatusExecuted,
      content.whyNotStatusFired,
      content.whyNotStatusNotReached,
      content.whyNotStatusRejected,
    ],
  );

  const cells = useMemo<Cell[]>(() => {
    if (!selectionFocus || !trace) {
      return [];
    }

    const acc: Cell[] = [];

    walkDecisions(trace.decisions, (decision) => {
      if (decision.listId === selectionFocus.listId) {
        const evaluation =
          decision.evaluations.find(
            (entry) => entry.actionIndex === selectionFocus.actionIndex,
          ) ?? null;

        acc.push({
          evaluation,
          status: evaluation?.status ?? null,
          timeMs: decision.timeMs,
        });
      } else {
        acc.push({
          evaluation: null,
          status: null,
          timeMs: decision.timeMs,
        });
      }
    });

    return acc;
  }, [selectionFocus, trace]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.whyNotTitle}</CardTitle>
        <CardDescription>{content.whyNotDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {selectionFocus === null && (
          <p className="text-xs text-muted-foreground">
            {content.whyNotIdleHint}
          </p>
        )}

        {selectionFocus !== null && cells.length === 0 && (
          <p className="text-xs text-muted-foreground">
            {content.previewTimelineEmpty}
          </p>
        )}

        {selectionFocus !== null && cells.length > 0 && (
          <div
            className="flex max-w-full flex-wrap gap-0.5 overflow-x-auto"
            role="list"
            aria-label={content.whyNotTitle.value}
          >
            {cells.map((cell, idx) => (
              <WhyNotCell
                // eslint-disable-next-line @eslint-react/no-array-index-key -- positional projection of an immutable trace; cells share timeMs (nested decisions) and have no stable id
                key={`${cell.timeMs}-${idx}`}
                cell={cell}
                absentLabel={content.whyNotStatusAbsent.value}
                statusLabel={statusLabel}
                ariaLabel={(timeMs, status) =>
                  content.whyNotCellAriaLabel({
                    status,
                    timeMs,
                  }).value
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WhyNotCell({
  absentLabel,
  ariaLabel,
  cell,
  statusLabel,
}: Readonly<WhyNotCellProps>) {
  const status = cell.status;
  const label = status === null ? absentLabel : statusLabel[status];
  const bg = status === null ? ABSENT_BG : STATUS_BG[status];
  const reason = cell.evaluation?.rejectionReason;

  const cellBody = (
    <div
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel(cell.timeMs, label)}
      className={cn(
        "h-6 w-2.5 cursor-default rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
        bg,
      )}
    />
  );

  if (status === null && !reason) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cellBody}</TooltipTrigger>
        <TooltipContent>
          <span className="text-xs">
            {cell.timeMs} ms ·{label}
          </span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{cellBody}</TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-0.5 text-xs">
          <span>
            {cell.timeMs} ms ·{label}
          </span>
          {reason && <span className="opacity-80">{reason}</span>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
