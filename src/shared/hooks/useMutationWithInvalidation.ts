"use client";

import { useMutation } from "@/shared/hooks/useMutation";

export function useMutationWithInvalidation<TArgs, TResult>(
  mutationFn: (args: TArgs) => Promise<TResult>,
  onInvalidate: () => void | Promise<unknown>,
) {
  const base = useMutation(mutationFn);

  return {
    ...base,
    mutate: (
      args: TArgs,
      options?: Parameters<typeof base.mutate>[1],
    ) =>
      base.mutate(args, {
        ...options,
        onSuccess: (data) => {
          void onInvalidate();
          options?.onSuccess?.(data);
        },
      }),
    mutateAsync: async (
      args: TArgs,
      options?: Parameters<typeof base.mutateAsync>[1],
    ) => {
      const result = await base.mutateAsync(args, options);
      await onInvalidate();
      return result;
    },
  };
}
