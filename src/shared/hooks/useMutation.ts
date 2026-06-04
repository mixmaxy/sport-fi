"use client";

import { useCallback, useState } from "react";

type MutationOptions<TResult> = {
  onSuccess?: (data: TResult) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export function useMutation<TArgs = void, TResult = unknown>(
  mutationFn: (args: TArgs) => Promise<TResult>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const mutate = useCallback(
    async (args: TArgs, options?: MutationOptions<TResult>) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await mutationFn(args);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        setError(err);
        options?.onError?.(err);
        throw err;
      } finally {
        setIsPending(false);
        options?.onSettled?.();
      }
    },
    [mutationFn],
  );

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending, error };
}
