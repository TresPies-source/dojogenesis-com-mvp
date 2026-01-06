type ActionHandler = () => void;

interface ActionMapConfig {
  [key: string]: {
    message?: string;
    handler?: (payload: any, itemId: string) => Promise<void>;
  };
}

interface CopyActionPayload {
  scope: 'last_user_message' | 'last_user_message_with_context' | 'last_turn';
  format: 'text' | 'markdown';
  include?: {
    timestamp?: boolean;
    conversation_title?: boolean;
    last_assistant_summary?: boolean;
  };
}

const ACTION_CONFIG: ActionMapConfig = {
  'dojo.onboard.start_situation': {
    message: "What situation are you facing?",
  },
  'dojo.onboard.add_lenses': {
    message: "What are three different perspectives you could apply to this situation?",
  },
  'dojo.onboard.show_example': {
    message: "Show me an example of using the Dojo Protocol with a sample situation",
  },
  'dojo.onboard.help_frame': {
    message: "I'm not sure how to frame my situation. Can you help me with some questions?",
  },
  'dojo.onboard.generate_next_move': {
    message: "Based on the perspectives collected, what's a clear next move?",
  },
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
  'dojo.copy.last_prompt': {
    handler: async (payload: CopyActionPayload, itemId: string) => {
      await handleCopyAction(payload);
    },
  },
  'dojo.copy.last_exchange': {
    handler: async (payload: CopyActionPayload, itemId: string) => {
      await handleCopyAction(payload);
    },
  },
};

async function handleCopyAction(payload: CopyActionPayload): Promise<void> {
  try {
    let textToCopy = '';

    if (payload.scope === 'last_user_message') {
      textToCopy = extractLastUserMessage();
    } else if (payload.scope === 'last_user_message_with_context') {
      textToCopy = extractLastUserMessageWithContext(payload.include);
    } else if (payload.scope === 'last_turn') {
      textToCopy = extractLastExchange(payload.format);
    }

    if (!textToCopy) {
      console.warn('[ChatKit Actions] No message found to copy');
      showCopyFeedback('No message found', false);
      return;
    }

    await navigator.clipboard.writeText(textToCopy);
    showCopyFeedback('Copied ✓', true);
  } catch (error) {
    console.error('[ChatKit Actions] Failed to copy to clipboard:', error);
    showCopyFeedback('Copy failed', false);
  }
}

function extractLastUserMessage(): string {
  const messages = document.querySelectorAll('[data-role="user"], .user-message, [class*="user"]');
  if (messages.length === 0) return '';
  
  const lastMessage = messages[messages.length - 1];
  return lastMessage.textContent?.trim() || '';
}

function extractLastUserMessageWithContext(include?: CopyActionPayload['include']): string {
  const userMessage = extractLastUserMessage();
  if (!userMessage) return '';

  let contextText = '';
  
  if (include?.timestamp) {
    contextText += `**Time**: ${new Date().toLocaleString()}\n\n`;
  }

  if (include?.last_assistant_summary) {
    const assistantMessages = document.querySelectorAll('[data-role="assistant"], .assistant-message, [class*="assistant"]');
    if (assistantMessages.length > 0) {
      const lastAssistant = assistantMessages[assistantMessages.length - 1];
      const assistantText = lastAssistant.textContent?.trim() || '';
      if (assistantText) {
        const summary = assistantText.length > 200 ? assistantText.substring(0, 200) + '...' : assistantText;
        contextText += `**Previous response**: ${summary}\n\n`;
      }
    }
  }

  contextText += `**Your prompt**:\n${userMessage}`;
  return contextText;
}

function extractLastExchange(format: 'text' | 'markdown'): string {
  const userMessage = extractLastUserMessage();
  const assistantMessages = document.querySelectorAll('[data-role="assistant"], .assistant-message, [class*="assistant"]');
  
  if (!userMessage) return '';
  
  let exchangeText = '';
  
  if (format === 'markdown') {
    exchangeText = `## User\n${userMessage}\n\n`;
    
    if (assistantMessages.length > 0) {
      const lastAssistant = assistantMessages[assistantMessages.length - 1];
      const assistantText = lastAssistant.textContent?.trim() || '';
      if (assistantText) {
        exchangeText += `## Assistant\n${assistantText}`;
      }
    }
  } else {
    exchangeText = `User: ${userMessage}\n\n`;
    
    if (assistantMessages.length > 0) {
      const lastAssistant = assistantMessages[assistantMessages.length - 1];
      const assistantText = lastAssistant.textContent?.trim() || '';
      if (assistantText) {
        exchangeText += `Assistant: ${assistantText}`;
      }
    }
  }
  
  return exchangeText;
}

function showCopyFeedback(message: string, success: boolean): void {
  const existingFeedback = document.getElementById('copy-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }

  const feedback = document.createElement('div');
  feedback.id = 'copy-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${success ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      feedback.remove();
      style.remove();
    }, 300);
  }, 2000);
}

export interface WidgetActionPayload {
  action: string;
  itemId: string;
  userId?: string;
  timestamp?: string;
}

export function handleWidgetAction(
  actionType: string,
  itemId: string,
  sendMessageCallback: (message: string) => void,
  payload?: any
): void {
  const config = ACTION_CONFIG[actionType];

  if (config) {
    if (config.handler) {
      config.handler(payload, itemId).catch((error) => {
        console.error(`[ChatKit Actions] Handler error for ${actionType}:`, error);
      });
    } else if (config.message) {
      sendMessageCallback(config.message);
    }
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
