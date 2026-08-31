import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { captureError } from "@/lib/observability";

// Queries and mutations may opt out of automatic error logging for expected failures.
type CaptureMeta = {
  skipCapture?: boolean;
};

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: CaptureMeta;
    queryMeta: CaptureMeta;
  }
}

let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    // docref:start state-mgmt-query-client
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
          retry: false,
          staleTime: Infinity,
        },
      },
      mutationCache: new MutationCache({
        onError: (error, _vars, _ctx, mutation) => {
          if (mutation.meta?.skipCapture) {
            return;
          }

          captureError(error, "react-query", "Mutation failed", {
            mutationKey: mutation.options.mutationKey,
          });
        },
      }),
      queryCache: new QueryCache({
        onError: (error, query) => {
          if (query.meta?.skipCapture) {
            return;
          }

          captureError(error, "react-query", "Query failed", {
            queryHash: query.queryHash,
            queryKey: query.queryKey,
          });
        },
      }),
    });
    // docref:end state-mgmt-query-client
  }

  return queryClient;
}
