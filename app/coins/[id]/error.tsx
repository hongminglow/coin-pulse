'use client';

import { useEffect } from 'react';
import ApiErrorFallback from '@/components/ApiErrorFallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ApiErrorFallback title="Unable to load coin details" error={error} onRetry={reset} />;
}
