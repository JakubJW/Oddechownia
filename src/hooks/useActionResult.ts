import { useState, useCallback } from 'react';

import { ActionResult } from '@/actions/types';

interface AsyncActionState<TData> {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: TData | null;
  error: string | null;
  reset: () => void;
}

export function useActionResult<
  TArgs extends any[] = any[],
  TSuccessData = unknown
>(
  action: (...args: TArgs) => Promise<ActionResult<TSuccessData>>,
  options?: {
    onSuccess?: (data: TSuccessData, message?: string) => void;
    onError?: (error: string) => void;
    onSettled?: (
      result: ActionResult<TSuccessData> | null,
      error: string | null,
      args: TArgs
    ) => void;
  }
): AsyncActionState<TSuccessData> & {
  execute: (...args: TArgs) => Promise<void>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<TSuccessData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(false);
    setData(null);
    setError(null);
  }, []);

  const execute = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      setData(null);
      setError(null);

      let result: ActionResult<TSuccessData> | null = null;
      let caughtError: string | null = null;

      try {
        result = await action(...args);

        if (result.success) {
          setIsSuccess(true);
          setData(result.data);
          options?.onSuccess?.(result.data);
        } else {
          setIsError(true);
          caughtError = result.error || 'Action failed.';
          setError(caughtError);
          options?.onError?.(caughtError);
        }
      } catch (err: unknown) {
        setIsError(true);
        caughtError = (err as Error).message || 'An unexpected error occurred.';
        setError(caughtError);
        options?.onError?.(caughtError);
      } finally {
        setIsLoading(false);
        options?.onSettled?.(result, caughtError, args);
      }
    },
    [action, options]
  );

  return { isLoading, isError, isSuccess, data, error, reset, execute };
}
