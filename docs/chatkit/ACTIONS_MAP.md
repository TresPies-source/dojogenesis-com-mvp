# ChatKit Widget Actions Map

This document maps each widget action type to its intended UX behavior in the DojoGenesis.com MVP.

## Action → Behavior Mapping

| Action Type | Button Text | Intended Behavior | Implementation Strategy |
|-------------|-------------|-------------------|------------------------|
| `dojo.onboard.start_situation` | "Start with a real situation" | Prompts user to describe their current situation in the chat input | Insert prompt: "What situation are you facing?" into chat or send via `sendAction()` |
| `dojo.onboard.add_lenses` | "Add 3 perspectives" | Guides user to add three distinct perspectives/lenses to their situation | Insert prompt: "What are three different perspectives you could apply to this situation?" or trigger workflow step |
| `dojo.onboard.show_example` | "Show me an example" | Demonstrates a complete Dojo Protocol flow with a sample scenario | Send pre-defined example scenario to workflow: "Show me an example of using the Dojo Protocol with a sample situation" |
| `dojo.onboard.help_frame` | "I'm stuck — help me frame it" | Provides scaffolding questions to help user articulate their situation | Send to workflow: "I'm not sure how to frame my situation. Can you help me with some questions?" |
| `dojo.onboard.generate_next_move` | "Generate a next move" | Synthesizes perspectives into an actionable next step | Send to workflow: "Based on the perspectives collected, what's a clear next move?" |

## Implementation Notes

### Client-Side Handler Pattern

```typescript
function handleWidgetAction(actionType: string, itemId: string) {
  const actionMap: Record<string, () => void> = {
    'dojo.onboard.start_situation': () => {
      sendMessageToChat("What situation are you facing?");
    },
    'dojo.onboard.add_lenses': () => {
      sendMessageToChat("What are three different perspectives you could apply to this situation?");
    },
    'dojo.onboard.show_example': () => {
      sendMessageToChat("Show me an example of using the Dojo Protocol with a sample situation");
    },
    'dojo.onboard.help_frame': () => {
      sendMessageToChat("I'm not sure how to frame my situation. Can you help me with some questions?");
    },
    'dojo.onboard.generate_next_move': () => {
      sendMessageToChat("Based on the perspectives collected, what's a clear next move?");
    },
  };

  const handler = actionMap[actionType];
  if (handler) {
    handler();
  } else {
    console.warn(`Unhandled widget action: ${actionType}`);
  }
}
```

### Alternative: Using ChatKit sendAction()

If ChatKit's `sendAction()` method is available, actions can be sent directly to the workflow:

```typescript
chatkit.sendAction({
  type: actionType,
  itemId: itemId,
});
```

**MVP Decision**: Start with message insertion method (simpler, no dependency on workflow action handling). Migrate to `sendAction()` in V1 if workflow requires it.

## Server-Side Logging

All actions are logged to `/api/widget-action` for analytics (MVP: console logging only).

**Logged Data**:
- `action`: Action type (e.g., "start_situation")
- `itemId`: Widget ID (e.g., "hello_agent_widget")
- `userId`: Device ID
- `timestamp`: ISO 8601 timestamp

## Future Enhancements

### V1 Improvements
- **Action analytics**: Track which actions lead to completed flows
- **Contextual actions**: Show/hide actions based on conversation state
- **Output format picker**: Add UI for selecting output format (PDF, Markdown, Plain Text)

### V2 Possibilities
- Custom action handlers per workflow
- Server-side action processing for complex logic
- Action chaining (one action triggers a sequence)

---

**Last Updated**: 2026-01-06  
**Status**: Updated with namespaced action types
