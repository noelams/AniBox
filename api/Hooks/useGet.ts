import {
  useQuery,
  type UseQueryResult,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateQueryHookArgs } from "../../Types/hooks.types";
import { axiosInstanceBackend, axiosInstanceMal } from "../config/axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";

export function createGetQueryHook<
  TData,
  RouteParams extends Record<string, string | number | undefined> = Record<
    string,
    string | number | undefined
  >,
  QueryParams extends Record<string, string | number | undefined> = Record<
    string,
    string | number | undefined
  >,
>({
  endpoint,
  queryKey,
  requestDestination,
  onError,
  onSettled,
  onSuccess,
}: CreateQueryHookArgs) {
  return (params?: {
    query?: QueryParams;
    route?: RouteParams;
    headers?: Record<string, string | undefined>;
  }) => {
    const queryClient = useQueryClient();
    const { userToken } = useContext(AuthContext);

    const queryFn = async (): Promise<TData> => {
      let url = endpoint;
      if (params?.route) {
        url = Object.entries(params.route).reduce(
          (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
          endpoint,
        );
      }

      // Handle query parameters
      if (params?.query) {
        const query = new URLSearchParams();
        Object.entries(params.query).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          query.append(key, String(value));
        });
        if (query.toString()) {
          url += `?${query.toString()}`;
        }
      }

      const headers = {
        ...params?.headers,
        ...(requestDestination ? { Authorization: `Bearer ${userToken}` } : {}),
      };
      const axiosInstance =
        requestDestination === "BACKEND"
          ? axiosInstanceBackend
          : axiosInstanceMal;
      const response = await axiosInstance.get(url, { headers });
      console.log("Fetching new URL:", url);
      return response.data as TData;
    };

    const query = useQuery({
      queryKey: [...queryKey, params?.query, params?.route],
      queryFn,
    });
    useEffect(() => {
      if (query.isSuccess) {
        onSuccess?.(query.data, queryClient);
      }
    }, [query.isSuccess, query.data]);
    useEffect(() => {
      if (query.isError) {
        onError?.(query.error as Error, queryClient);
      }
    }, [query.isError, query.error]);

    useEffect(() => {
      if (!query.isPending) {
        onSettled?.(query.data, query.error as Error | null, queryClient);
      }
    }, [query.isPending, query.data, query.error]);

    return query;
  };
}
