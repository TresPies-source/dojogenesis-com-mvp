import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const CHATKIT_API_URL = 'https://api.openai.com/v1/chatkit/sessions';
const WORKFLOW_ID = 'wf_69504ca5bd048190a8e10c1486defe7a07130d0df37f6b51';

interface SessionRequest {
  userId: string;
}

interface ChatKitSessionResponse {
  session_token: string;
  expires_at: string;
}

export async function POST(request: NextRequest) {
  try {
    let apiKey: string | undefined;
    
    if (typeof getRequestContext === 'function') {
      try {
        const { env } = getRequestContext();
        apiKey = env.OPENAI_API_KEY;
      } catch (error) {
        console.warn('[ChatKit Session] getRequestContext failed, using process.env fallback');
      }
    }
    
    if (!apiKey) {
      apiKey = process.env.OPENAI_API_KEY;
    }
    
    if (!apiKey) {
      console.error('[ChatKit Session] OPENAI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error', message: 'API key not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json() as SessionRequest;
    
    if (!body.userId) {
      return NextResponse.json(
        { error: 'Validation error', message: 'userId is required' },
        { status: 400 }
      );
    }

    console.log('[ChatKit Session] Creating session for user:', body.userId);

    const response = await fetch(CHATKIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'chatkit_beta=v1',
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        user: body.userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ChatKit Session] OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication error', message: 'We\'re experiencing technical difficulties. Please try again later.' },
          { status: 500 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit error', message: 'Too many people are using Dojo Genesis right now. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      if (response.status >= 500) {
        return NextResponse.json(
          { error: 'Service error', message: 'The AI service is temporarily unavailable. Please try again in a few moments.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'Service error', message: 'We couldn\'t start your session. Please refresh the page and try again.' },
        { status: response.status }
      );
    }

    const data = await response.json() as ChatKitSessionResponse;
    
    console.log('[ChatKit Session] Session created successfully');
    
    return NextResponse.json({
      session_token: data.session_token,
      expires_at: data.expires_at,
    });

  } catch (error) {
    console.error('[ChatKit Session] Unexpected error:', error);
    
    let errorMessage = 'Something unexpected happened. Please refresh the page and try again.';
    let statusCode = 500;
    
    if (error instanceof SyntaxError) {
      errorMessage = 'Something went wrong. Please refresh the page and try again.';
      statusCode = 400;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Unable to connect to the AI service. Please check your internet connection and try again.';
      statusCode = 503;
    }

    return NextResponse.json(
      { error: 'Internal server error', message: errorMessage },
      { status: statusCode }
    );
  }
}
