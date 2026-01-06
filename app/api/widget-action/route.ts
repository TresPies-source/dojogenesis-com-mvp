import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface WidgetActionRequest {
  action: string;
  itemId?: string;
  userId?: string;
  timestamp?: string;
}

interface WidgetActionResponse {
  logged: true;
}

export async function POST(request: NextRequest): Promise<NextResponse<WidgetActionResponse | { error: string }>> {
  try {
    const body: WidgetActionRequest = await request.json();
    
    const logData = {
      action: body.action || 'unknown',
      itemId: body.itemId || null,
      userId: body.userId || null,
      timestamp: body.timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
    };

    console.log('[Widget Action]', JSON.stringify(logData, null, 2));

    return NextResponse.json({ logged: true });
  } catch (error) {
    console.error('[Widget Action Error]', error);
    return NextResponse.json({ logged: true }, { status: 200 });
  }
}
