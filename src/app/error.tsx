'use client';

import { useEffect } from 'react';
import { ErrorMessage } from '@/components';

interface ErrorPageProps {
  error: Error & { digest?: string };
  /** Mencoba merender ulang segmen yang error. */
  reset: () => void;
}

/** Error boundary global untuk App Router. Wajib berupa Client Component. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Catat error ke console (bisa diganti dengan layanan monitoring).
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorMessage onRetry={reset} />;
}
