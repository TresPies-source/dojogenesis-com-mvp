# DojoGenesis.com MVP - Implementation Specification

## Complexity Assessment: HARD

This task involves:
- Complex ChatKit API integration with custom widget handling
- Multiple moving parts (client/server boundaries, session management, action handlers)
- Security-sensitive implementation (API key management)
- Custom widget system with client-side action routing
- Deployment configuration for production domain
- High quality bar (performance, visual design, error handling)

## Technical Context

**Language**: TypeScript  
**Framework**: Next.js 14+ (App Router)  
**Runtime**: Node.js 18+ / 20+  
**Styling**: TailwindCSS 3+ with shadcn/ui components  
**Testing**: Playwright for E2E smoke tests  
**Deployment**: Vercel with custom domain (DojoGenesis.com)

**Key Dependencies**:
- `next` (14.x)
- `react` (18.x)
- `@openai/chatkit-react` (latest)
- `typescript` (5.x)
- `tailwindcss` (3.x)
- `@playwright/test` (latest)
- `shadcn/ui` components (via CLI)

## Implementation Approach

### Phase 1: Project Scaffolding
1. Initialize Next.js 14 project with TypeScript and App Router
2. Configure TailwindCSS with custom theme
3. Set up shadcn/ui component library
4. Create base file structure
5. Configure .gitignore and .env.example

### Phase 2: ChatKit Integration
1. Implement `/api/chatkit/session` route handler
   - Call OpenAI ChatKit sessions API
   - Handle errors gracefully
   - Return session token to client
2. Create device ID management utility (`lib/device-id.ts`)
3. Build `ChatKitDemo` component with session initialization
4. Integrate `@openai/chatkit-react` package
5. Test session creation and chat rendering

### Phase 3: Widget System
1. Implement `/api/widget-action` logging endpoint
2. Create widget action handler (`lib/chatkit-actions.ts`)
3. Set up `widgets.onAction` event listener
4. Map actions to chat interactions (per ACTIONS_MAP.md)
5. Test each button action in Hello Agent widget

### Phase 4: Landing Page
1. Build `Hero` component with required copy
2. Create responsive layout with TailwindCSS
3. Integrate `ChatKitDemo` component into landing page
4. Add `Footer` with privacy statement
5. Optimize for mobile and desktop viewports

### Phase 5: Testing & Quality
1. Set up Playwright with basic configuration
2. Write smoke test: page loads, chat mounts
3. Run Lighthouse audit (target: > 85)
4. Test error states (network failure, session errors)
5. Manual testing across browsers and devices

### Phase 6: Deployment
1. Create Vercel project and link GitHub repo
2. Configure environment variables in Vercel
3. Deploy to production
4. Connect custom domain (DojoGenesis.com)
5. Verify deployment and run post-deployment checks

## Source Code Structure Changes

### New Files to Create

**Configuration Files**:
```
/package.json                          # Project dependencies and scripts
/tsconfig.json                         # TypeScript compiler configuration
/next.config.js                        # Next.js configuration
/tailwind.config.ts                    # Tailwind customization
/playwright.config.ts                  # Playwright test configuration
/.env.example                          # Environment variable template
/.gitignore                            # Git ignore rules
/components.json                       # shadcn/ui configuration
```

**Application Code**:
```
/app/layout.tsx                        # Root layout with metadata
/app/page.tsx                          # Landing page (/)
/app/globals.css                       # Global styles and Tailwind imports
/app/api/chatkit/session/route.ts      # ChatKit session creation API
/app/api/widget-action/route.ts        # Widget action logging API
```

**Components**:
```
/components/ChatKitDemo.tsx            # ChatKit integration wrapper
/components/Hero.tsx                   # Hero section with value prop
/components/Footer.tsx                 # Footer with privacy statement
/components/ui/button.tsx              # shadcn/ui Button (via CLI)
/components/ui/card.tsx                # shadcn/ui Card (via CLI)
/components/ui/...                     # Additional UI primitives as needed
```

**Library/Utilities**:
```
/lib/device-id.ts                      # Device ID generation and storage
/lib/utils.ts                          # Utility functions (cn, etc.)
/lib/chatkit-actions.ts                # Widget action handlers
```

**Tests**:
```
/tests/smoke.spec.ts                   # Playwright smoke test
```

**Documentation** (already created):
```
/docs/PRD_DOJOGENESIS_MVP.md
/docs/TECH_SPEC_DOJOGENESIS_MVP.md
/docs/chatkit/HELLO_WIDGET_OPTION_A.json
/docs/chatkit/ACTIONS_MAP.md
```

### Modified Files
None (greenfield project)

## Data Model / API / Interface Changes

### API Routes

#### `POST /api/chatkit/session`
**Request**:
```typescript
interface SessionRequest {
  userId: string; // Device ID (UUID format)
}
```

**Response** (Success):
```typescript
interface SessionResponse {
  session_token: string;
  expires_at: string;
}
```

**Response** (Error):
```typescript
interface ErrorResponse {
  error: string;
  message?: string;
}
```

#### `POST /api/widget-action`
**Request**:
```typescript
interface WidgetActionRequest {
  action: string;        // Action type (e.g., "start_situation")
  itemId: string;        // Widget ID
  userId: string;        // Device ID
  timestamp: string;     // ISO 8601 timestamp
}
```

**Response**:
```typescript
interface WidgetActionResponse {
  logged: boolean;
}
```

### Client-Side Interfaces

#### Device ID
```typescript
// lib/device-id.ts
export function getOrCreateDeviceId(): string;
```

#### ChatKit Action Handler
```typescript
// lib/chatkit-actions.ts
export type ActionType = 
  | "start_situation"
  | "add_perspectives"
  | "show_example"
  | "help_frame"
  | "generate_move"
  | "pick_output";

export function handleWidgetAction(
  actionType: ActionType,
  itemId: string,
  sendMessage: (text: string) => void
): void;
```

### Environment Variables
```typescript
// Server-side only
process.env.OPENAI_API_KEY: string;

// Client-accessible (optional)
process.env.NEXT_PUBLIC_SITE_URL?: string;
```

## Verification Approach

### Automated Verification

1. **TypeScript Compilation**:
   ```bash
   npm run build
   # Must complete with 0 type errors
   ```

2. **Linting** (if configured):
   ```bash
   npm run lint
   # Must pass with 0 errors
   ```

3. **Playwright Smoke Test**:
   ```bash
   npm run test:e2e
   # Must pass: page loads, chat container mounts
   ```

4. **Lighthouse Performance**:
   ```bash
   npm run lighthouse
   # Score must be > 85
   ```

### Manual Verification Checklist

**Pre-Deployment**:
- [ ] `npm run dev` starts without errors
- [ ] Landing page renders at http://localhost:3000
- [ ] ChatKit demo initializes and displays chat interface
- [ ] All 6 buttons in Hello Agent widget are visible
- [ ] Clicking each button triggers expected behavior (per ACTIONS_MAP.md)
- [ ] DeviceId stored in localStorage (check DevTools)
- [ ] No console errors in browser DevTools
- [ ] No API keys or secrets visible in client bundle (check Network tab)
- [ ] Error state displays when API key is invalid (test with bad .env)

**Post-Deployment**:
- [ ] Site accessible at https://dojogenesis.com
- [ ] SSL certificate valid (https:// works)
- [ ] Chat initializes within 3 seconds
- [ ] Mobile responsive (test on 320px, 768px, 1024px viewports)
- [ ] Test on iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari
- [ ] Vercel deployment logs show no 5xx errors
- [ ] Privacy statement visible in footer
- [ ] All links functional

### Test Commands

**Development**:
```bash
npm run dev            # Start development server
npm run build          # Production build
npm run start          # Serve production build
npm run lint           # Run ESLint (if configured)
npm run type-check     # TypeScript type checking (if configured)
```

**Testing**:
```bash
npm run test:e2e       # Run Playwright tests
npm run lighthouse     # Run Lighthouse audit (if configured)
```

**Deployment**:
```bash
npx vercel             # Deploy to Vercel preview
npx vercel --prod      # Deploy to production
```

## Security Considerations

1. **API Key Protection**:
   - ✅ Store `OPENAI_API_KEY` in `.env.local` (git-ignored)
   - ✅ Access only in server-side API routes
   - ✅ Never expose in client-side code or logs
   - ✅ Configure as secret in Vercel dashboard

2. **Input Validation**:
   - Validate `userId` format (UUID) in session API
   - Sanitize any logged data (no PII)

3. **Rate Limiting** (documented, not implemented in MVP):
   - Consider Vercel Edge Middleware for rate limiting in V1
   - Monitor API usage in OpenAI dashboard

4. **Dependency Security**:
   - Run `npm audit` before deployment
   - Keep dependencies updated
   - Use `npm audit fix` to patch vulnerabilities

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| ChatKit API changes during development | Pin `@openai/chatkit-react` version; refer to docs daily |
| Session creation failures in production | Implement robust error handling; show friendly error messages |
| Performance issues with ChatKit script | Lazy load ChatKit component; optimize bundle size |
| Custom domain DNS propagation delays | Set up domain early; allow 24-48h for propagation |
| API key leakage | Code review checklist; automated secret scanning (future) |

## Success Criteria

Implementation is complete when:
- ✅ All files in "Source Code Structure Changes" are created
- ✅ All automated verification steps pass
- ✅ All manual verification checklist items pass
- ✅ Site deployed to https://dojogenesis.com
- ✅ Lighthouse performance score > 85
- ✅ No TypeScript errors or linting errors
- ✅ Playwright smoke test passes
- ✅ README.md created with setup instructions

---

**Prepared By**: AI Agent  
**Date**: 2026-01-06  
**Next Step**: Proceed to detailed implementation plan in plan.md
