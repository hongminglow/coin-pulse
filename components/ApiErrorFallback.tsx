'use client';

import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ApiErrorFallbackProps = {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
};

function getErrorMessage(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function isRateLimitError(message: string): boolean {
  const msg = message.toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('too many requests') ||
    msg.includes('rate limit') ||
    msg.includes('rate-limit')
  );
}

const ApiErrorFallback = ({
  title = 'Unable to load data',
  description,
  error,
  onRetry,
  className,
}: ApiErrorFallbackProps) => {
  const message = useMemo(() => getErrorMessage(error), [error]);
  const rateLimited = useMemo(() => isRateLimitError(message), [message]);

  const handleRetry = useCallback(() => {
    if (onRetry) return onRetry();
    window.location.reload();
  }, [onRetry]);

  const effectiveDescription =
    description ??
    (rateLimited
      ? "CoinGecko's free/demo API is rate-limited. Please wait a bit and try again."
      : 'Something went wrong while fetching crypto data.');

  return (
    <div className={cn('main-container', className)}>
      <div className="w-full rounded-lg border border-dark-400 bg-dark-500 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-md bg-red-500/10 p-3 text-red-500">
            <AlertTriangle className="size-5" />
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            <p className="mt-1 text-sm text-purple-100">{effectiveDescription}</p>

            {message ? (
              <div className="mt-4 rounded-md border border-dark-400 bg-dark-700 p-3">
                <p className="text-xs font-medium text-purple-100/70">Details</p>
                <p className="mt-1 text-xs text-purple-100 wrap-break-word">{message}</p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCcw className="size-4" />
                Try again
              </Button>

              <Button variant="outline" asChild className="gap-2">
                <Link href="/">
                  <Home className="size-4" />
                  Back home
                </Link>
              </Button>

              <Button variant="ghost" asChild className="gap-2">
                <Link href="/coins">All coins</Link>
              </Button>
            </div>

            {rateLimited ? (
              <p className="mt-4 text-xs text-purple-100/70">
                Tip: the free/demo tier can temporarily block frequent refreshes.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiErrorFallback;
