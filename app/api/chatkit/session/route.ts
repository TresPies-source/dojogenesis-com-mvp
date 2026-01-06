import { NextRequest, NextResponse } from 'next/server';

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
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('[ChatKit Session] OPENAI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error', message: 'We\'re experiencing technical difficulties. Please try again later.' },
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
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'Something went wrong. Please refresh the page and try again.' },
        { status: 400 }
      );
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error', message: 'Unable to connect to the AI service. Please check your internet connection and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Something unexpected happened. Please refresh the page and try again.' },
      { status: 500 }
    );
  }
}
