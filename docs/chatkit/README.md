# ChatKit Widgets

This directory contains widget definitions for the Dojo Genesis ChatKit integration.

## Available Widgets

### 1. Hello Agent Widget
**File**: `HELLO_WIDGET_OPTION_A.json`  
**Purpose**: Onboarding widget that introduces users to the Dojo Protocol and guides them through framing their situation with perspectives.

**Actions**:
- Start with a real situation
- Add 3 perspectives
- Show me an example
- I'm stuck — help me frame it
- Generate a next move

---

### 2. Copy Last Prompt Widget
**File**: `DOJO_COPY_LAST_PROMPT_WIDGET_V1.json`  
**Purpose**: Clipboard utility widget that allows users to copy their last prompt or entire conversation exchanges for use in external tools (GitHub issues, docs, Zenflow tasks, etc.).

**Actions**:
- **Copy last prompt**: Copies the user's most recent message as plain text
- **Copy last prompt (with context)**: Copies the last user message with timestamp and assistant summary in markdown format
- **Copy last exchange (prompt + reply)**: Copies both the last user prompt and assistant response in markdown format

---

## Widget Architecture

Widgets are JSON-based definitions that describe the UI components and actions. When a widget action is triggered:

1. The action is logged to `/api/widget-action` for analytics
2. The action handler is called from `lib/chatkit-actions.ts`
3. For message-based actions, text is inserted into the chat input
4. For clipboard actions, content is copied and feedback is shown

See `ACTIONS_MAP.md` for detailed action type documentation.
