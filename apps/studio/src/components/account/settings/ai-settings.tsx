"use client";

import { useIntlayer } from "next-intlayer";

import type { AiProvider } from "@wowlab/shared/lib/ai-contract";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import {
  ClaudeIcon,
  OpenAIIcon,
  OpenRouterIcon,
} from "@wowlab/shared/lib/icons";

import { AiCurrentProvider } from "./ai-current-provider";
import { AiModelSelector } from "./ai-model-selector";
import { useAiSettingsForm } from "./use-ai-settings-form";

const PROVIDER_ICONS = {
  anthropic: ClaudeIcon,
  openai: OpenAIIcon,
  openrouter: OpenRouterIcon,
} as const;

const PROVIDER_ORDER = [
  "openrouter",
  "openai",
  "anthropic",
] as const satisfies readonly AiProvider[];

export function AiSettings() {
  const content = useIntlayer("aiSettings");
  const form = useAiSettingsForm();

  const providerLabels: Record<AiProvider, string> = {
    anthropic: content.providerAnthropic.value,
    openai: content.providerOpenai.value,
    openrouter: content.providerOpenrouter.value,
  };

  if (form.isLoading) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {form.current.keySet && form.current.provider && (
        <AiCurrentProvider
          label={providerLabels[form.current.provider]}
          icon={PROVIDER_ICONS[form.current.provider]}
          removing={form.removing}
          onRemove={form.onRemove}
        />
      )}

      <div className="flex flex-col gap-2">
        <Label>{content.providerLabel}</Label>
        <Select
          value={form.provider}
          onValueChange={(v) => form.onProviderChange(v as AiProvider)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_ORDER.map((p) => {
              const Icon = PROVIDER_ICONS[p];

              return (
                <SelectItem key={p} value={p}>
                  <Icon className="size-4" />
                  {providerLabels[p]}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ai-api-key">{content.apiKeyLabel}</Label>
        <div className="flex gap-2">
          <Input
            id="ai-api-key"
            type="password"
            autoComplete="off"
            value={form.apiKey}
            placeholder={
              form.current.keySet
                ? content.apiKeyPlaceholderSet.value
                : content.apiKeyPlaceholder.value
            }
            onChange={(e) => form.setApiKey(e.target.value)}
          />
          <Button
            variant="outline"
            disabled={!form.hasNewKey || form.validating}
            onClick={form.onValidate}
          >
            {content.validateButton}
          </Button>
        </div>
        {form.invalidKey && (
          <p className="text-sm text-destructive">{content.invalidKey}</p>
        )}
        {form.validated && (
          <p className="text-sm text-muted-foreground">
            {form.credits === undefined
              ? content.validKey
              : content.validKeyCredits({ credits: String(form.credits) })}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{content.modelLabel}</Label>
        <AiModelSelector
          models={form.models}
          value={form.model}
          onChange={form.onModelChange}
        />
      </div>

      {form.hasNewKey && (
        <div className="flex justify-end">
          <Button
            disabled={!form.validated || !form.model || form.saving}
            onClick={form.onSave}
          >
            {content.saveButton}
          </Button>
        </div>
      )}

      {form.saveError && (
        <Alert variant="destructive">
          <AlertTitle>{content.saveErrorTitle}</AlertTitle>
          <AlertDescription>{content.saveError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
