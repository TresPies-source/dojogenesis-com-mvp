# Technical Specification: "Hello Agent" Onboarding Widget

## Difficulty Assessment
**Medium** - Requires updating existing widget JSON structure, modifying action handlers to support new action types with namespaced naming conventions, and ensuring the new ChatKit widget components render correctly. No new architecture needed, but involves careful integration of the provided JSON spec with existing action handling patterns.

---

## Technical Context

### Language & Framework
- **Next.js 15.1.4** (App Router)
- **TypeScript 5**
- **React 19**
- **ChatKit React SDK** (`@openai/chatkit-react ^1.4.0`)

### Dependencies
- **TailwindCSS 3.4.1** - Styling (not directly used in widget JSON)
- **shadcn/ui** - UI components (page-level only; widgets use ChatKit components)

### Current Architecture
- **Widget Definition**: JSON files in `/docs/chatkit/` directory
- **Action Handling**: Client-side via `lib/chatkit-actions.ts` with action-to-message mapping
- **Widget Integration**: `ChatKitDemo.tsx` component loads ChatKit script and sets up `window.widgets.onAction()` handler
- **Server Logging**: Actions logged to `/api/widget-action` for analytics

---

## Implementation Approach

### Overview
Replace the existing "Hello Agent" widget (HELLO_WIDGET_OPTION_A.json) with the new, more sophisticated widget structure that uses ChatKit's advanced layout components (Card, Row, Col, Markdown, etc.) and namespaced action types.

### Key Changes

#### 1. Widget JSON Structure
- **Old**: Simple `card` type with basic `title`, `text`, and `buttons` array
- **New**: `Card` container with nested layout components:
  - `Row` for header layout (Title + Badge)
  - `Markdown` for rich text content
  - `Divider` for visual separation
  - `Col` for button stack
  - `Caption` for footer tip
  - `Button` components with `onClickAction` config

#### 2. Action Type Naming Convention
- **Old**: Simple action names (`start_situation`, `add_perspectives`, etc.)
- **New**: Namespaced action types (`dojo.onboard.start_situation`, `dojo.onboard.add_lenses`, etc.)

#### 3. Action Configuration
- **Old**: Action type only
- **New**: Full `ActionConfig` with:
  - `type`: Action identifier
  - `payload`: Contextual data (step name, count, example ID)
  - `loading`: Loading indicator behavior (`"container"`)

#### 4. Button Actions Mapping
The new widget defines 5 button actions:

| Button Label | Action Type | Payload | Current Handler Message |
|--------------|-------------|---------|------------------------|
| "Start with a real situation" | `dojo.onboard.start_situation` | `{ step: "situation" }` | "What situation are you facing?" |
| "Add 3 perspectives" | `dojo.onboard.add_lenses` | `{ step: "lenses", count: 3 }` | "What are three different perspectives you could apply to this situation?" |
| "Show me an example" | `dojo.onboard.show_example` | `{ example: "dojogenesis_hello_agent_v1" }` | "Show me an example of using the Dojo Protocol with a sample situation" |
| "I'm stuck — help me frame it" | `dojo.onboard.help_frame` | `{ step: "framing" }` | "I'm not sure how to frame my situation. Can you help me with some questions?" |
| "Generate a next move" | `dojo.onboard.generate_next_move` | `{ step: "next_move" }` | "Based on the perspectives collected, what's a clear next move?" |

**Note**: The new action type `dojo.onboard.add_lenses` replaces `add_perspectives`, and `dojo.onboard.generate_next_move` replaces `generate_move`. The `pick_output` action has been removed.

---

## Source Code Structure Changes

### Files to Modify

#### 1. `/docs/chatkit/HELLO_WIDGET_OPTION_A.json`
- **Change**: Replace entire file contents with the new widget JSON structure
- **Reason**: This is the widget definition file that ChatKit workflow references

#### 2. `/lib/chatkit-actions.ts`
- **Change**: Update `ACTION_CONFIG` to map new namespaced action types
- **Additions**:
  ```typescript
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
  };
  ```
- **Backward Compatibility**: Keep old action types for now to avoid breaking existing workflows (can be removed in future cleanup)

#### 3. `/docs/chatkit/ACTIONS_MAP.md` (Documentation only)
- **Change**: Update action mapping table to reflect new action types and removed `pick_output` action
- **Reason**: Keep documentation in sync with implementation

### Files to Create
**None** - All required files exist in the codebase.

---

## Data Model / API Changes

### No API Changes Required
- `/api/chatkit/session` - No changes needed
- `/api/widget-action` - No changes needed (already accepts arbitrary action types)

### No Data Model Changes
- Action logging schema remains the same
- Widget actions are logged as strings in existing format

### TypeScript Interface Updates
No new interfaces needed. The existing `WidgetActionPayload` interface in `lib/chatkit-actions.ts` already supports arbitrary action type strings.

---

## Verification Approach

### 1. Type Checking
```bash
npm run build
```
**Expected**: Clean TypeScript compilation with no type errors

### 2. Linting
```bash
npm run lint
```
**Expected**: No ESLint warnings or errors

### 3. Manual Testing
1. **Start dev server**: `npm run dev`
2. **Load application**: Navigate to `http://localhost:3000`
3. **Wait for ChatKit to load**: Verify session creation and widget rendering
4. **Visual inspection**: Confirm new widget structure appears with:
   - Title: "Welcome to Dojo Genesis"
   - Badge: "Perspectives → clarity"
   - Markdown content with bold formatting
   - Dividers between sections
   - 5 buttons in correct order and styling
   - Caption at bottom
5. **Test each button**: Click each of the 5 buttons and verify:
   - Button click triggers `window.widgets.onAction()`
   - Correct message is sent to chat input
   - Action is logged to server console via `/api/widget-action`
6. **Check browser console**: Verify no JavaScript errors or unhandled action warnings

### 4. E2E Test (Optional Enhancement)
Update `tests/smoke.spec.ts` to:
- Wait for widget to render
- Verify button presence by counting buttons (should be 5)
- Click first button and verify chat input receives message

```typescript
// Pseudo-code for test enhancement
test('Hello Agent widget renders with 5 buttons', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="chatkit-demo"]');
  
  // Wait for widget to load (may need custom selector)
  const buttons = await page.locator('button').count();
  expect(buttons).toBeGreaterThanOrEqual(5);
});
```

### 5. Deployment Verification
After deploying to Cloudflare Pages:
1. Visit production URL
2. Verify widget renders correctly in production environment
3. Test all 5 button actions
4. Check server logs for action logging

---

## Edge Cases and Considerations

### 1. Widget Loading State
- **Issue**: Widget may not render immediately due to ChatKit script loading
- **Mitigation**: Existing `ChatKitDemo.tsx` already handles loading state with skeleton UI

### 2. Action Type Namespace
- **Issue**: New namespaced action types (`dojo.onboard.*`) may not be recognized if widget JSON key doesn't match
- **Mitigation**: Ensure exact string match in `ACTION_CONFIG` mapping

### 3. ChatKit Component Support
- **Issue**: Newer ChatKit components (Row, Col, Markdown, Badge, etc.) may not be supported in current SDK version
- **Mitigation**: Test rendering immediately after implementation. If components don't render, consult ChatKit SDK documentation for version requirements

### 4. Payload Data Unused
- **Issue**: Action payloads (e.g., `{ step: "situation" }`) are currently not used by client handler
- **Future Enhancement**: Could be used for analytics or conditional behavior in future iterations

### 5. Removed Action
- **Issue**: `pick_output` action is removed from new widget
- **Impact**: If workflow references this action elsewhere, it may break
- **Mitigation**: Document the removal; update workflow if needed (outside scope of this task)

---

## Success Criteria

✅ Widget JSON file updated with new structure  
✅ Action handlers updated to support new namespaced action types  
✅ TypeScript compilation succeeds with no errors  
✅ All 5 buttons trigger correct chat messages  
✅ Actions are logged to server console  
✅ No console errors or warnings in browser  
✅ Widget renders correctly in local development  
✅ Documentation updated to reflect changes

---

## Future Enhancements (Out of Scope)

- **Server-side action handling**: Implement `ChatKitServer.action()` method to handle actions server-side instead of client-side message insertion
- **Payload utilization**: Use action payload data for analytics, conditional flows, or workflow state management
- **Dynamic widget updates**: Update widget content based on conversation state
- **Action analytics**: Track which actions lead to completed Dojo Protocol flows

---

**Specification Created**: 2026-01-06  
**Estimated Implementation Time**: 30-45 minutes  
**Risk Level**: Low (isolated changes, existing patterns)
