import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePostMutationHookArgs } from "../../Types/hooks.types";
import { axiosInstanceBackend, axiosInstanceMal } from "../config/axios";

export function createPostMutationHook<TData, TResponse>({
  endpoint,
  requestDestination,
  onSuccess,
  onError,
  onSettled,
  customHeaders = {},
  mutationOptions,
}: CreatePostMutationHookArgs) {
  return () => {
    const queryClient = useQueryClient();

    const mutationFn = async (data: TData) => {
      const headers = { ...customHeaders };

      const axiosInstance =
        requestDestination === "BACKEND"
          ? axiosInstanceBackend
          : axiosInstanceMal;

      const response = await axiosInstance.post<TResponse>(endpoint, data, {
        headers,
      });
      return response.data;
    };

    return useMutation({
      mutationFn,
      onSuccess: (data, variables) => {
        onSuccess?.(data, variables, queryClient);
      },
      onError: (error, variables) =>
        onError?.(error as Error, variables, queryClient),
      onSettled: (data, error, variables) =>
        onSettled?.(data, error as Error | null, variables, queryClient),
      ...mutationOptions,
    });
  };
}
