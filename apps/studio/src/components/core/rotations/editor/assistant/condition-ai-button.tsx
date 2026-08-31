"use client";

import { SparklesIcon, WandSparklesIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { aiFetch } from "@/lib/ai/client";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import { Textarea } from "@wowlab/shared/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";

import type { Condition, ConditionEditorCtx } from "../types";

type ConditionAiButtonProps = {
  ctx: ConditionEditorCtx;
  onGenerated: (condition: Condition) => void;
};

export function ConditionAiButton({
  ctx,
  onGenerated,
}: Readonly<ConditionAiButtonProps>) {
  const content = useIntlayer("rotationAssistant");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await aiFetch("object", {
        contextMarkdown: "",
        grammar: {
          auraSlugs: ctx.auraSlugs,
          descriptors: ctx.descriptors,
          resourceNames: ctx.resourceNames,
          spellSlugs: ctx.spellSlugs,
        },
        kind: "condition",
        request: text,
      });

      if (!res.ok) {
        setError(true);

        return;
      }

      const { object } = (await res.json()) as { object: Condition | null };

      if (object == null || typeof object !== "object") {
        setError(true);

        return;
      }

      onGenerated(object);
      setOpen(false);
      setText("");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-6 text-primary"
              aria-label={content.conditionAiAriaLabel.value}
            >
              <SparklesIcon className="size-3" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{content.conditionAiTooltip}</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80 space-y-2">
        <p className="text-sm font-medium">{content.conditionAiTitle}</p>
        <Textarea
          autoFocus
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={content.conditionAiPlaceholder.value}
        />
        {error && (
          <p className="text-xs text-destructive">{content.errorGeneration}</p>
        )}
        <Button
          size="sm"
          className="w-full"
          disabled={!text.trim() || loading}
          onClick={run}
        >
          <WandSparklesIcon className="size-3.5" />
          {content.generateButton}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
