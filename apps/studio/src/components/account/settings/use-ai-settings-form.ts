"use client";

import { useRequest } from "ahooks";
import { useState } from "react";

import type {
  AiModelOption,
  AiProvider,
  ValidateKeyResponse,
} from "@wowlab/shared/lib/ai-contract";

import { aiFetch } from "@/lib/ai/client";
import {
  useAiSettings,
  useClearAiCredentials,
  useSetAiCredentials,
  useUpdateAiModel,
} from "@/lib/query/services/auth";

export function useAiSettingsForm() {
  const settings = useAiSettings();
  const current = settings.data ?? {
    keySet: false,
    model: null,
    provider: null,
  };

  const setCreds = useSetAiCredentials();
  const clearCreds = useClearAiCredentials();
  const updateModel = useUpdateAiModel();

  const [providerOverride, setProviderOverride] = useState<AiProvider | null>(
    null,
  );
  const [modelOverride, setModelOverride] = useState<null | string>(null);
  const [apiKey, setApiKey] = useState("");
  const [models, setModels] = useState<AiModelOption[]>([]);
  const [invalidKey, setInvalidKey] = useState(false);

  const provider: AiProvider =
    providerOverride ?? current.provider ?? "openrouter";
  const model = modelOverride ?? current.model ?? "";

  useRequest(
    async () => {
      const res = await aiFetch("models", {});

      if (!res.ok) {
        return [];
      }

      const body = (await res.json()) as { models: AiModelOption[] };

      return body.models;
    },
    {
      onSuccess: setModels,
      ready: current.keySet && !providerOverride,
      refreshDeps: [current.keySet, current.provider],
    },
  );

  const validate = useRequest(
    async () => {
      setInvalidKey(false);
      const res = await aiFetch("validate-key", { apiKey, provider });

      return (await res.json()) as ValidateKeyResponse;
    },
    {
      manual: true,
      onSuccess: (result) => {
        if (result.valid) {
          setModels(result.models ?? []);
        } else {
          setInvalidKey(true);
        }
      },
    },
  );

  const onProviderChange = (next: AiProvider) => {
    setProviderOverride(next);
    setModelOverride(null);
    setApiKey("");
    setModels([]);
    setInvalidKey(false);
  };

  const onModelChange = (id: string) => {
    setModelOverride(id);

    if (current.keySet && !apiKey.trim() && current.provider === provider) {
      updateModel.mutate({ model: id });
    }
  };

  const onSave = () => {
    if (!model) {
      return;
    }

    setCreds.mutate(
      { apiKey, model, provider },
      {
        onSuccess: () => {
          setApiKey("");
          setProviderOverride(null);
          setModelOverride(null);
        },
      },
    );
  };

  return {
    apiKey,
    credits: validate.data?.credits,
    current,
    hasNewKey: apiKey.trim().length > 0,
    invalidKey,
    isLoading: settings.isLoading,
    model,
    models,
    onModelChange,
    onProviderChange,
    onRemove: () => clearCreds.mutate(),
    onSave,
    onValidate: () => validate.run(),
    provider,
    removing: clearCreds.isPending,
    saveError: Boolean(setCreds.error || updateModel.error),
    saving: setCreds.isPending,
    setApiKey,
    validated: validate.data?.valid === true,
    validating: validate.loading,
  };
}
