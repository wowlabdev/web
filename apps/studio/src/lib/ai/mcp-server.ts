import type { McpServerConfig } from "@wowlab/shared/lib/ai-contract";

export type McpServerInput = Omit<McpServerConfig, "id">;

export function withOptionalHeader(
  base: McpServerInput,
  headerName: string | undefined,
  headerValue: string | undefined,
): McpServerInput {
  return headerName && headerValue
    ? { ...base, headerName, headerValue }
    : base;
}
