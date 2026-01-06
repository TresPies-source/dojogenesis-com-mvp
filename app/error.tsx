'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="text-center space-y-6 max-w-lg bg-white p-8 rounded-lg shadow-lg border border-red-200">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center" aria-hidden="true">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Something Went Wrong
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
            We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          </p>
          {error.message && (
            <details className="text-left bg-gray-50 p-4 rounded-md border border-gray-200">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Technical details
              </summary>
              <p className="mt-2 text-xs font-mono text-gray-600 break-words">
                {error.message}
              </p>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all font-medium"
            aria-label="Try to recover from error"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all font-medium"
            aria-label="Return to home page"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
