import { QueryClient } from "@tanstack/react-query";

type QueryKey =
  | [string]
  | [string, Record<string, string | number | undefined>];

export interface CreateQueryHookArgs {
  endpoint: string;
  queryKey: QueryKey;
  requestDestination?: "BACKEND" | "MAL";
  onError?: (error: Error, queryClient: QueryClient) => void;
  onSettled?: (
    data: any | undefined,
    error: Error | null,
    queryClient: QueryClient,
  ) => void;
  onSuccess?: (data: any, queryClient: QueryClient) => void;
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnMount?: boolean;
    retry?:
      | boolean
      | number
      | ((failureCount: number, error: unknown) => boolean);
    cacheTime?: number;
    staleTime?: number;
  };
}
