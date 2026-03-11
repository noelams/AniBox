import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePostMutationHookArgs } from "../../Types/hooks.types";
import { axiosInstanceBackend, axiosInstanceMal } from "../config/axios";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export function createPostMutationHook<TData, TResponse>({
  endpoint,
  requestDestination,
  onSuccess,
  onError,
  onSettled,
  customHeaders = {},
  mutationOptions,
}: CreatePostMutationHookArgs<TData, TResponse>) {
  return () => {
    const queryClient = useQueryClient();
    const { userToken } = useContext(AuthContext);
    const mutationFn = async (data: TData): Promise<TResponse> => {
      const headers = {
        ...customHeaders,
        ...(requestDestination === "BACKEND"
          ? { Authorization: `Bearer ${userToken}` }
          : {}),
      };

      const axiosInstance =
        requestDestination === "BACKEND"
          ? axiosInstanceBackend
          : axiosInstanceMal;

      const response = await axiosInstance.post<TResponse>(endpoint, data, {
        headers,
      });
      console.log("enpoint", endpoint);
      return response.data;
    };

    return useMutation<TResponse, Error, TData>({
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
