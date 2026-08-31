import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryResult } from "@/lib/data/result";
import type {
  AiProvider,
  McpServerConfig,
} from "@wowlab/shared/lib/ai-contract";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryResult } from "@/lib/data/result";
import { isAiProvider } from "@wowlab/shared/lib/ai-contract";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { type RpcReturns, throwIfError } from "./shared";
import { useUserId } from "./user";

export type TokenType = "api" | "claim";

export const NODES_KEY = ["nodes"] as const;

export const USER_SETTINGS_KEY = ["user_settings"] as const;

const TOKEN_CONFIG = {
  api: {
    column: "token_api",
    rpc: "regenerate_token_api",
  },
  claim: {
    column: "token_claim",
    rpc: "regenerate_token_claim",
  },
} as const;

export type AiSettings = {
  keySet: boolean;
  model: null | string;
  provider: AiProvider | null;
};
type TokenColumn = (typeof TOKEN_CONFIG)[TokenType]["column"];
type TokenRpc = (typeof TOKEN_CONFIG)[TokenType]["rpc"];

type TokenValue = Row<"user_settings">[TokenColumn];

export function useAiMcpServers(): QueryResult<McpServerConfig[]> {
  const userId = useUserId();

  const query = useQuery<McpServerConfig[]>({
    enabled: !!userId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_settings")
        .select("mcp_servers")
        .eq("id", userId!)
        .single();

      throwIfError(error);

      return (data?.mcp_servers ?? []) as McpServerConfig[];
    },
    queryKey: [...USER_SETTINGS_KEY, userId, "mcp"],
  });

  return { ...toQueryResult(query), data: query.data ?? [] };
}

export function useAiSettings(): QueryResult<AiSettings> {
  const userId = useUserId();

  const query = useQuery<AiSettings>({
    enabled: !!userId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_settings")
        .select("ai_provider, ai_model, ai_key_secret_id")
        .eq("id", userId!)
        .single();

      throwIfError(error);

      return {
        keySet: !!data?.ai_key_secret_id,
        model: data?.ai_model ?? null,
        provider: isAiProvider(data?.ai_provider) ? data.ai_provider : null,
      };
    },
    queryKey: [...USER_SETTINGS_KEY, userId, "ai"],
  });

  return {
    ...toQueryResult(query),
    data: query.data ?? { keySet: false, model: null, provider: null },
  };
}

export function useClearAiCredentials() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.rpc("clear_ai_credentials");

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY });
    },
  });
}

export function useRegenerateToken(tokenType: TokenType) {
  const queryClient = useQueryClient();
  const rpc: TokenRpc = TOKEN_CONFIG[tokenType].rpc;

  return useMutation<RpcReturns<TokenRpc>, Error, void>({
    mutationFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc(rpc);

      throwIfError(error);

      if (!data) {
        throw new Error(`${rpc} returned no token`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY });

      if (tokenType === "claim") {
        queryClient.invalidateQueries({ queryKey: NODES_KEY });
      }
    },
  });
}

export function useSetAiCredentials() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { apiKey: string; model: string; provider: AiProvider }
  >({
    mutationFn: async ({ apiKey, model, provider }) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("set_ai_credentials", {
        p_key: apiKey,
        p_model: model,
        p_provider: provider,
      });

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY });
    },
  });
}

export function useToken(tokenType: TokenType): QueryResult<TokenValue> {
  const userId = useUserId();
  const column: TokenColumn = TOKEN_CONFIG[tokenType].column;

  const query = useQuery<TokenValue>({
    enabled: !!userId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_settings")
        .select(column)
        .eq("id", userId!)
        .single();

      throwIfError(error);

      const row = data as Record<TokenColumn, TokenValue> | null;

      return row?.[column] ?? "";
    },
    queryKey: [...USER_SETTINGS_KEY, userId, tokenType, column],
  });

  return { ...toQueryResult(query), data: query.data ?? "" };
}

export function useUpdateAiMcpServers() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation<void, Error, { servers: McpServerConfig[] }>({
    mutationFn: async ({ servers }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_settings")
        .update({ mcp_servers: servers })
        .eq("id", userId!);

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY });
    },
  });
}

export function useUpdateAiModel() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation<void, Error, { model: string }>({
    mutationFn: async ({ model }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_settings")
        .update({ ai_model: model })
        .eq("id", userId!);

      throwIfError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY });
    },
  });
}
