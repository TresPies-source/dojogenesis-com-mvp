import { NextRequest, NextResponse } from 'next/server';

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
          { error: 'Authentication error', message: 'Invalid API key' },
          { status: 500 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit error', message: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'OpenAI API error', message: `Failed to create session: ${response.statusText}` },
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
        { error: 'Invalid request', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error', message: 'Unable to reach OpenAI API. Please check your connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
