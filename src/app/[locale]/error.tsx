// src/app/[locale]/error.tsx

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('❌ Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-soft">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-brand-text mb-4">
          Something went wrong!
        </h1>
        <p className="text-brand-text-secondary mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="btn-secondary"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}