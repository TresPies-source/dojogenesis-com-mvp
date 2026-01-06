'use client';

import { useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '@/lib/device-id';
import { handleWidgetAction, logWidgetAction } from '@/lib/chatkit-actions';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionResponse {
  session_token: string;
  expires_at: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

declare global {
  interface Window {
    ChatKit?: {
      render: (config: { container: HTMLElement; sessionToken: string }) => void;
    };
    widgets?: {
      onAction: (handler: (action: { type: string }, itemId: string) => void) => void;
    };
  }
}

export function ChatKitDemo() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    async function initializeSession() {
      try {
        setLoading(true);
        setError(null);

        const id = getOrCreateDeviceId();
        
        if (!id) {
          throw new Error('Unable to generate device ID');
        }

        setDeviceId(id);

        const response = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: id }),
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

    const setupWidgetHandlers = () => {
      if (window.widgets) {
        window.widgets.onAction((action: { type: string; payload?: any }, itemId: string) => {
          logWidgetAction({
            action: action.type,
            itemId,
            userId: deviceId,
          });

          const sendMessage = (message: string) => {
            const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
            const textareaElement = document.querySelector('textarea') as HTMLTextAreaElement;
            
            if (inputElement) {
              inputElement.value = message;
              const event = new Event('input', { bubbles: true });
              inputElement.dispatchEvent(event);
              
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
              });
              inputElement.dispatchEvent(enterEvent);
            } else if (textareaElement) {
              textareaElement.value = message;
              const event = new Event('input', { bubbles: true });
              textareaElement.dispatchEvent(event);
              
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
              });
              textareaElement.dispatchEvent(enterEvent);
            } else {
              console.warn('[ChatKit] Could not find input element to send message');
            }
          };

          handleWidgetAction(action.type, itemId, sendMessage, action.payload);
        });
      }
    };

    const loadChatKit = () => {
      const container = document.getElementById('chatkit-container');
      if (!container) return;

      const renderChatKit = () => {
        if (window.ChatKit) {
          window.ChatKit.render({
            container,
            sessionToken,
          });
          
          setTimeout(setupWidgetHandlers, 1500);
        }
      };

      if (window.ChatKit) {
        renderChatKit();
      } else {
        const script = document.createElement('script');
        script.src = 'https://chatkit.openai.com/v1/chatkit.js';
        script.async = true;
        script.onload = renderChatKit;
        script.onerror = () => {
          setError('Failed to load ChatKit. Please check your connection and try again.');
        };
        document.body.appendChild(script);
      }
    };

    loadChatKit();
  }, [sessionToken, deviceId]);

  if (loading) {
    return (
      <div 
        data-testid="chatkit-demo" 
        className="w-full min-h-[500px] md:min-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 space-y-4"
        role="status"
        aria-live="polite"
        aria-label="Loading Dojo Genesis chat interface"
      >
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 md:h-4 w-24 md:w-32" />
            <Skeleton className="h-2 md:h-3 w-36 md:w-48" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 md:h-16 w-full" />
          <Skeleton className="h-12 md:h-16 w-3/4" />
          <Skeleton className="h-12 md:h-16 w-5/6" />
        </div>
        <div className="flex items-center justify-center py-8 md:py-12">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="relative w-10 h-10 md:w-12 md:h-12 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium px-4">
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
        className="flex items-center justify-center min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-4"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center space-y-4 max-w-md">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center" aria-hidden="true">
            <svg
              className="w-7 h-7 md:w-8 md:h-8 text-red-600"
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
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Unable to Start Session</h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 md:px-6 py-2 bg-red-600 text-white text-sm md:text-base rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all font-medium"
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
    <div 
      data-testid="chatkit-demo" 
      className="w-full min-h-[500px] md:min-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      role="region"
      aria-label="Dojo Genesis chat interface"
    >
      <div 
        id="chatkit-container" 
        className="w-full h-full min-h-[500px] md:min-h-[600px]"
        role="application"
        aria-label="ChatKit conversation interface"
      />
    </div>
  );
}
