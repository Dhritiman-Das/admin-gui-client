import { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useMutation as useReactQueryMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
  message: string;
}

export function useMutation<
  TData = unknown,
  TError = AxiosError<ErrorResponse>,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useReactQueryMutation({
    ...options,
    onError: (error: any) => {
      toast.error(
        error.response?.data.message ||
          error.message ||
          "An error occurred. Please try again after some time"
      );
    },
  });
}
