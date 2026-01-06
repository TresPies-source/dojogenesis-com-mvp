# Technical Specification: Copy Last Prompt Widget

## Complexity Assessment
**Medium** - Straightforward widget integration with clipboard functionality, but requires conversation context access and action handler implementation.

## Technical Context
- **Framework**: Next.js 15.1.4 (TypeScript, React 19)
- **ChatKit Integration**: @openai/chatkit-react ^1.4.0
- **Runtime**: Edge (Cloudflare Pages)
- **Widget Architecture**: JSON-based widget definitions in `/docs/chatkit/`, action handlers in `/lib/chatkit-actions.ts`

## Implementation Approach

### 1. Widget JSON File
Create `/docs/chatkit/DOJO_COPY_LAST_PROMPT_WIDGET_V1.json` with the provided JSON specification. The widget defines three copy actions:
- `dojo.copy.last_prompt` - Copy last user message only
- `dojo.copy.last_prompt` (with context) - Copy last user message with timestamp and assistant summary
- `dojo.copy.last_exchange` - Copy last user prompt + assistant reply

### 2. Action Handlers
Extend `/lib/chatkit-actions.ts` to handle three new action types:
- `dojo.copy.last_prompt` (scope: `last_user_message`)
- `dojo.copy.last_prompt` (scope: `last_user_message_with_context`)
- `dojo.copy.last_exchange` (scope: `last_turn`)

**Implementation approach**:
- Use browser Clipboard API (`navigator.clipboard.writeText()`)
- Extract conversation context from ChatKit DOM or state
- Format text based on action payload (text vs markdown format)
- Show temporary "Copied ✓" feedback to user

**Key challenge**: Accessing conversation history from ChatKit. Options:
1. Parse ChatKit DOM to extract messages
2. Maintain client-side conversation state in `ChatKitDemo.tsx`
3. Use ChatKit API if available to get conversation context

**Decision**: Start with DOM parsing approach (most straightforward for MVP), can migrate to state management if needed.

### 3. Documentation
Create `/docs/chatkit/README.md` to document:
- List of available widgets
- Widget purposes
- Action types

## Source Code Changes

### Files to Create
1. `/docs/chatkit/DOJO_COPY_LAST_PROMPT_WIDGET_V1.json` - Widget definition (provided)
2. `/docs/chatkit/README.md` - Widget catalog documentation

### Files to Modify
1. `/lib/chatkit-actions.ts`
   - Add action configurations for copy actions
   - Implement clipboard handlers
   - Add conversation context extraction logic

2. `/docs/chatkit/ACTIONS_MAP.md`
   - Document new action types and behaviors

## Data Model / API / Interface Changes

### Action Payload Structure
```typescript
interface CopyActionPayload {
  scope: 'last_user_message' | 'last_user_message_with_context' | 'last_turn';
  format: 'text' | 'markdown';
  include?: {
    timestamp?: boolean;
    conversation_title?: boolean;
    last_assistant_summary?: boolean;
  };
}
```

### New Action Handler Signature
```typescript
function handleCopyAction(
  payload: CopyActionPayload,
  conversationContext: ConversationMessage[]
): Promise<void>
```

## Verification Approach

### Manual Testing
1. Load the app in browser
2. Have a conversation with at least 2 exchanges
3. Verify widget appears after assistant response
4. Click "Copy last prompt" - verify clipboard contains last user message
5. Click "Copy last prompt (with context)" - verify clipboard contains formatted message with context
6. Click "Copy last exchange" - verify clipboard contains user + assistant messages
7. Verify "Copied ✓" feedback appears briefly

### Automated Testing
- Run `npm run lint` to verify TypeScript types
- Run `npm run build` to ensure no build errors
- Existing smoke tests should still pass

### Edge Cases to Test
- Empty conversation (no messages yet)
- Very long messages (clipboard truncation)
- Special characters / markdown in messages
- Multiple rapid clicks on copy buttons

## Implementation Notes

### Widget Rendering
The widget JSON file doesn't need to be explicitly imported in the code. Based on the existing architecture, ChatKit workflow likely references widgets by filename or is configured server-side to render specific widgets after responses.

### Clipboard Permissions
Modern browsers require user interaction to write to clipboard. The button click events should satisfy this requirement. For HTTPS-only contexts (production), ensure clipboard API is available.

### Future Enhancements
- Copy entire conversation history
- Export to different formats (JSON, PDF)
- Share conversation via link
- Selective message copying (checkboxes)
