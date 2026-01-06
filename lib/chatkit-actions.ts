type ActionHandler = () => void;

interface ActionMapConfig {
  [key: string]: {
    message: string;
  };
}

const ACTION_CONFIG: ActionMapConfig = {
  start_situation: {
    message: "What situation are you facing?",
  },
  add_perspectives: {
    message: "What are three different perspectives you could apply to this situation?",
  },
  show_example: {
    message: "Show me an example of using the Dojo Protocol with a sample situation",
  },
  help_frame: {
    message: "I'm not sure how to frame my situation. Can you help me with some questions?",
  },
  generate_move: {
    message: "Based on the perspectives collected, what's a clear next move?",
  },
  pick_output: {
    message: "How would you like to receive your output?",
  },
};

export interface WidgetActionPayload {
  action: string;
  itemId: string;
  userId?: string;
  timestamp?: string;
}

export function handleWidgetAction(
  actionType: string,
  itemId: string,
  sendMessageCallback: (message: string) => void
): void {
  const config = ACTION_CONFIG[actionType];

  if (config) {
    sendMessageCallback(config.message);
  } else {
    console.warn(`[ChatKit Actions] Unhandled widget action: ${actionType}`);
  }
}

export async function logWidgetAction(payload: WidgetActionPayload): Promise<void> {
  try {
    const response = await fetch('/api/widget-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[ChatKit Actions] Failed to log action:', response.statusText);
    }
  } catch (error) {
    console.error('[ChatKit Actions] Error logging action:', error);
  }
}
