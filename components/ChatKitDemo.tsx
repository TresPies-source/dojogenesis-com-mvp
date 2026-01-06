'use client';

import { useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '@/lib/device-id';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionResponse {
  session_token: string;
  expires_at: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

export function ChatKitDemo() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeSession() {
      try {
        setLoading(true);
        setError(null);

        const deviceId = getOrCreateDeviceId();
        
        if (!deviceId) {
          throw new Error('Unable to generate device ID');
        }

        const response = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: deviceId }),
        });

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          throw new Error(errorData.message || 'Failed to create session');
        }

        const data: SessionResponse = await response.json();
        setSessionToken(data.session_token);
      } catch (err) {
        console.error('Session initialization failed:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    initializeSession();
  }, []);

  useEffect(() => {
    if (!sessionToken) return;

    const loadChatKit = () => {
      const container = document.getElementById('chatkit-container');
      if (!container) return;

      if ((window as any).ChatKit) {
        (window as any).ChatKit.render({
          container,
          sessionToken,
        });
      } else {
        const script = document.createElement('script');
        script.src = 'https://chatkit.openai.com/v1/chatkit.js';
        script.async = true;
        script.onload = () => {
          if ((window as any).ChatKit) {
            (window as any).ChatKit.render({
              container,
              sessionToken,
            });
          }
        };
        script.onerror = () => {
          setError('Failed to load ChatKit. Please check your connection and try again.');
        };
        document.body.appendChild(script);
      }
    };

    loadChatKit();
  }, [sessionToken]);

  if (loading) {
    return (
      <div 
        data-testid="chatkit-demo" 
        className="w-full min-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4"
        role="status"
        aria-live="polite"
        aria-label="Loading Dojo Genesis chat interface"
      >
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-5/6" />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Preparing your Dojo Genesis session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        data-testid="chatkit-demo" 
        className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center" aria-hidden="true">
            <svg
              className="w-8 h-8 text-red-600"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Start Session</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all font-medium"
            aria-label="Reload page to try again"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!sessionToken) {
    return null;
  }

  return (
    <div data-testid="chatkit-demo" className="w-full min-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div id="chatkit-container" className="w-full h-full min-h-[600px]" />
    </div>
  );
}
