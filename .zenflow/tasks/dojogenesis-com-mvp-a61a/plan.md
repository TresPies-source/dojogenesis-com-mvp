# DojoGenesis.com MVP - Implementation Plan

## Configuration
- **Artifacts Path**: `.zenflow/tasks/dojogenesis-com-mvp-a61a`
- **Complexity**: HARD
- **Estimated Timeline**: Full implementation (6-8 phases)

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: ab6ce333-a8a2-4023-8891-ff893a227fff -->

✅ **Completed**: Created comprehensive technical specification and supporting documentation:
- `/docs/PRD_DOJOGENESIS_MVP.md` - Product Requirements Document
- `/docs/TECH_SPEC_DOJOGENESIS_MVP.md` - Technical Specification
- `/docs/chatkit/HELLO_WIDGET_OPTION_A.json` - Widget JSON specification
- `/docs/chatkit/ACTIONS_MAP.md` - Action-to-behavior mapping
- `.zenflow/tasks/dojogenesis-com-mvp-a61a/spec.md` - Implementation spec

**Complexity Assessment**: HARD - Complex ChatKit integration, widget system, security requirements, deployment configuration.

---

### [ ] Step: Project Scaffolding and Configuration

**Goal**: Initialize Next.js project with all required tooling and configuration.

**Tasks**:
1. Run `npx create-next-app@latest` with TypeScript, App Router, TailwindCSS
2. Install dependencies: `@openai/chatkit-react`, `@playwright/test`
3. Initialize shadcn/ui: `npx shadcn-ui@latest init`
4. Configure `tailwind.config.ts` with custom theme (if needed)
5. Create `.env.example` with required variables
6. Update `.gitignore` to include `.env.local`, Vercel files
7. Create base file structure (`components/`, `lib/`, `tests/`, etc.)

**Verification**:
- [ ] `npm run dev` starts without errors
- [ ] TypeScript compilation succeeds
- [ ] TailwindCSS classes work in test component
- [ ] No committed secrets in `.gitignore`

**Files Created**:
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`
- `.env.example`, `.gitignore`, `components.json`
- Base directory structure

---

### [ ] Step: Utility Libraries and Device ID Management

**Goal**: Implement foundational utilities for device tracking and helper functions.

**Tasks**:
1. Create `/lib/utils.ts` with `cn()` utility for class merging
2. Create `/lib/device-id.ts` with `getOrCreateDeviceId()` function
   - Generate UUID using `crypto.randomUUID()`
   - Store in localStorage with key `dojo_device_id`
   - Handle SSR/client-side rendering safely
3. Write unit tests or manual verification for deviceId persistence

**Verification**:
- [ ] Device ID generates and persists in localStorage
- [ ] Same device ID returned on page refresh
- [ ] No errors in browser console
- [ ] SSR-safe (no `window` access during server render)

**Files Created**:
- `/lib/utils.ts`
- `/lib/device-id.ts`

---

### [ ] Step: ChatKit Session API Route

**Goal**: Implement server-side API route for creating ChatKit sessions.

**Tasks**:
1. Create `/app/api/chatkit/session/route.ts`
2. Implement POST handler:
   - Validate request body (`userId` field required)
   - Call OpenAI ChatKit API:
     - Endpoint: `POST https://api.openai.com/v1/chatkit/sessions`
     - Headers: `Authorization: Bearer {OPENAI_API_KEY}`, `OpenAI-Beta: chatkit_beta=v1`
     - Body: `{ workflow_id: "wf_69504ca5...", user: userId }`
   - Handle errors gracefully (network, auth, rate limit)
   - Return session token or error response
3. Add error logging (console.error with structured data)

**Verification**:
- [ ] POST to `/api/chatkit/session` returns session token (with valid API key)
- [ ] Returns 400 if `userId` missing
- [ ] Returns 500 if API key invalid (error logged server-side)
- [ ] Returns 503 if OpenAI API unreachable
- [ ] No API key exposed in response or logs

**Files Created**:
- `/app/api/chatkit/session/route.ts`

**Environment Variables Required**:
- `OPENAI_API_KEY`

---

### [ ] Step: Widget Action Logging API Route

**Goal**: Create stub endpoint for logging widget actions (future-proofing).

**Tasks**:
1. Create `/app/api/widget-action/route.ts`
2. Implement POST handler:
   - Accept body: `{ action, itemId, userId, timestamp }`
   - Log to console with structured format
   - Return `{ logged: true }`
3. Add TypeScript interfaces for request/response

**Verification**:
- [ ] POST to `/api/widget-action` returns `{ logged: true }`
- [ ] Action logged to console (visible in terminal during dev)
- [ ] No errors on invalid/missing fields (graceful handling)

**Files Created**:
- `/app/api/widget-action/route.ts`

---

### [ ] Step: shadcn/ui Components Installation

**Goal**: Install required UI components from shadcn/ui library.

**Tasks**:
1. Run `npx shadcn-ui@latest add button`
2. Run `npx shadcn-ui@latest add card`
3. (Optional) Add other components as needed: `separator`, `skeleton`, etc.
4. Verify components render correctly

**Verification**:
- [ ] Button component imported and renders
- [ ] Card component imported and renders
- [ ] No TypeScript errors
- [ ] Components styled with Tailwind classes

**Files Created**:
- `/components/ui/button.tsx`
- `/components/ui/card.tsx`
- (Additional components as needed)

---

### [ ] Step: ChatKit Integration Component

**Goal**: Build the core ChatKit demo component with session management.

**Tasks**:
1. Create `/components/ChatKitDemo.tsx`
2. Implement session initialization:
   - Get device ID on mount
   - Call `/api/chatkit/session` API
   - Handle loading, error, and success states
3. Integrate `@openai/chatkit-react` package:
   - Import `ChatKit` component
   - Pass session token as prop
4. Add error UI for session creation failures
5. Add loading state UI

**Verification**:
- [ ] Component fetches session token on mount
- [ ] ChatKit renders when session token available
- [ ] Loading state displays during session creation
- [ ] Error state displays if session creation fails
- [ ] Device ID passed correctly to API

**Files Created**:
- `/components/ChatKitDemo.tsx`

---

### [ ] Step: Widget Action Handlers

**Goal**: Implement client-side action handling for Hello Agent widget buttons.

**Tasks**:
1. Create `/lib/chatkit-actions.ts`
2. Implement `handleWidgetAction()` function:
   - Map action types to chat messages (per ACTIONS_MAP.md)
   - Accept callback to send message to chat
3. In `ChatKitDemo.tsx`:
   - Set up `widgets.onAction` listener (when ChatKit loads)
   - Call `handleWidgetAction` for each action
   - Send action log to `/api/widget-action`
4. Test each button action

**Verification**:
- [ ] Clicking "Start with a real situation" inserts prompt into chat
- [ ] Clicking "Show me an example" inserts example request
- [ ] All 6 buttons trigger expected behavior (per ACTIONS_MAP.md)
- [ ] Actions logged to `/api/widget-action`
- [ ] No console errors on button clicks

**Files Created/Modified**:
- `/lib/chatkit-actions.ts` (new)
- `/components/ChatKitDemo.tsx` (modified)

---

### [ ] Step: Landing Page - Hero Component

**Goal**: Create hero section with required copy and visual design.

**Tasks**:
1. Create `/components/Hero.tsx`
2. Implement hero section:
   - Headline with value proposition copy (per PRD)
   - Subheadline or supporting text
   - Clean, modern design with TailwindCSS
3. Make responsive (mobile, tablet, desktop)
4. Use shadcn/ui components where appropriate

**Verification**:
- [ ] Hero displays prominently on landing page
- [ ] Copy matches required text: "Dojo Genesis helps you think by collecting perspectives before solutions..."
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] No layout shift on page load

**Files Created**:
- `/components/Hero.tsx`

---

### [ ] Step: Landing Page - Footer Component

**Goal**: Create footer with privacy statement and links.

**Tasks**:
1. Create `/components/Footer.tsx`
2. Add privacy statement text
3. Add any necessary links (optional in MVP)
4. Style with TailwindCSS

**Verification**:
- [ ] Footer displays at bottom of page
- [ ] Privacy statement visible
- [ ] Responsive design
- [ ] Clean, minimal styling

**Files Created**:
- `/components/Footer.tsx`

---

### [ ] Step: Landing Page Assembly

**Goal**: Assemble complete landing page with all components.

**Tasks**:
1. Edit `/app/page.tsx`:
   - Import Hero, ChatKitDemo, Footer components
   - Create layout structure
   - Ensure chat demo visible without scrolling on desktop
2. Edit `/app/layout.tsx`:
   - Set page metadata (title, description)
   - Configure fonts if needed
3. Edit `/app/globals.css`:
   - Import Tailwind directives
   - Add any custom global styles

**Verification**:
- [ ] Landing page renders with all sections
- [ ] Chat demo visible on desktop without scrolling
- [ ] Page metadata correct (title, description)
- [ ] No console errors
- [ ] Fast load time (< 2 seconds on localhost)

**Files Modified**:
- `/app/page.tsx`
- `/app/layout.tsx`
- `/app/globals.css`

---

### [ ] Step: Playwright Smoke Test

**Goal**: Write and configure automated smoke test.

**Tasks**:
1. Create `playwright.config.ts`:
   - Configure base URL (localhost:3000)
   - Set browser(s) to test
   - Configure test directory
2. Create `/tests/smoke.spec.ts`:
   - Test 1: Page loads successfully
   - Test 2: Page title correct
   - Test 3: Chat container mounts (wait for selector)
   - (Optional) Test 4: No console errors
3. Add test script to `package.json`: `"test:e2e": "playwright test"`

**Verification**:
- [ ] `npm run test:e2e` executes Playwright tests
- [ ] All tests pass
- [ ] Tests fail appropriately when page broken

**Files Created**:
- `playwright.config.ts`
- `/tests/smoke.spec.ts`

**Files Modified**:
- `package.json` (add test script)

---

### [ ] Step: Error Handling and Polish

**Goal**: Add comprehensive error handling and UI polish.

**Tasks**:
1. Test session creation failure scenarios:
   - Invalid API key
   - Network offline
   - OpenAI API down
2. Ensure friendly error messages displayed
3. Add loading skeletons or spinners where appropriate
4. Test mobile responsiveness thoroughly
5. Fix any layout issues or visual bugs

**Verification**:
- [ ] Error messages clear and non-technical
- [ ] Loading states smooth and visible
- [ ] Mobile layout works on iOS Safari and Android Chrome
- [ ] No visual glitches or layout shifts
- [ ] Accessibility: semantic HTML, keyboard navigation

**Files Modified**:
- Various component files (as needed)

---

### [ ] Step: Performance Optimization and Lighthouse Audit

**Goal**: Ensure performance meets target (Lighthouse > 85).

**Tasks**:
1. Run Lighthouse audit in Chrome DevTools
2. Optimize images (if any added)
3. Minimize client-side JavaScript bundle
4. Check for unnecessary re-renders
5. Optimize Tailwind CSS (purge unused styles in production)
6. Test Core Web Vitals (LCP, FID, CLS)

**Verification**:
- [ ] Lighthouse Performance score > 85
- [ ] Lighthouse Accessibility score > 90
- [ ] Lighthouse Best Practices score > 90
- [ ] No major warnings in Lighthouse report
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

**Files Modified**:
- `next.config.js` (potential optimizations)
- Various components (code splitting, lazy loading)

---

### [ ] Step: Documentation - README

**Goal**: Create comprehensive README for setup and deployment.

**Tasks**:
1. Create `/README.md`:
   - Project overview
   - Prerequisites (Node.js version, API key)
   - Setup instructions
   - Environment variables guide
   - Development commands (`npm run dev`, etc.)
   - Deployment instructions (Vercel)
   - Testing instructions
   - Project structure overview
2. Verify instructions by following them in a clean environment (if possible)

**Verification**:
- [ ] README covers all setup steps
- [ ] Instructions clear for new developers
- [ ] All commands documented
- [ ] Links to documentation included

**Files Created**:
- `/README.md`

---

### [ ] Step: Pre-Deployment Checklist

**Goal**: Final verification before deploying to production.

**Tasks**:
1. Run full build: `npm run build`
2. Test production build locally: `npm run start`
3. Run all tests: `npm run test:e2e`
4. Verify no secrets in repository: `git grep -i "sk-proj"` (should return nothing)
5. Check `.gitignore` includes `.env.local`
6. Review all code for TODOs or console.logs
7. Verify `.env.example` is complete and accurate

**Verification Checklist**:
- [ ] `npm run build` succeeds with 0 errors
- [ ] `npm run start` serves production build correctly
- [ ] All Playwright tests pass
- [ ] No API keys or secrets in git history
- [ ] `.env.example` complete
- [ ] No console.log statements in production code (or acceptable)
- [ ] All TypeScript errors resolved
- [ ] No linting errors (if linter configured)

**No New Files** (verification step only)

---

### [ ] Step: Vercel Deployment Setup

**Goal**: Deploy application to Vercel and configure production environment.

**Tasks**:
1. Create GitHub repository (if not already created)
2. Push code to GitHub: `git push origin main`
3. Create Vercel project:
   - `npx vercel login`
   - `npx vercel link` (connect to GitHub repo)
4. Configure environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` (secret)
5. Deploy to production: `npx vercel --prod`
6. Verify deployment URL works

**Verification**:
- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables configured in Vercel
- [ ] Deployment succeeds
- [ ] Site accessible at Vercel preview URL
- [ ] Chat initializes correctly on deployed site

**External Actions** (not code changes):
- GitHub repository creation
- Vercel project setup
- Environment variable configuration

---

### [ ] Step: Custom Domain Configuration

**Goal**: Connect DojoGenesis.com domain to Vercel deployment.

**Tasks**:
1. In Vercel dashboard:
   - Navigate to project settings → Domains
   - Add domain: `dojogenesis.com`
   - Note DNS configuration instructions
2. Configure DNS records:
   - Add A or CNAME record as instructed by Vercel
3. Wait for DNS propagation and SSL provisioning
4. Verify site accessible at https://dojogenesis.com

**Verification**:
- [ ] Domain added in Vercel
- [ ] DNS records configured correctly
- [ ] SSL certificate provisioned (https:// works)
- [ ] Site loads at https://dojogenesis.com
- [ ] No certificate warnings

**External Actions**:
- DNS configuration (domain registrar)
- Vercel domain setup

---

### [ ] Step: Post-Deployment Verification

**Goal**: Comprehensive testing in production environment.

**Tasks**:
1. Visit https://dojogenesis.com
2. Test full user flow:
   - Page loads quickly
   - Chat initializes
   - Click each widget button
   - Send test messages
3. Test on multiple devices/browsers:
   - Desktop: Chrome, Firefox, Safari
   - Mobile: iOS Safari, Android Chrome
4. Check Vercel logs for errors
5. Run Lighthouse audit on production URL
6. Verify analytics/logging working (if implemented)

**Verification Checklist**:
- [ ] Site loads in < 3 seconds
- [ ] Chat interface functional
- [ ] All 6 widget buttons work
- [ ] Mobile responsive on real devices
- [ ] No console errors in production
- [ ] No 5xx errors in Vercel logs
- [ ] Lighthouse score > 85 on production
- [ ] SSL certificate valid

**No New Files** (verification step only)

---

### [ ] Step: Final Report and Handoff

**Goal**: Document implementation and prepare handoff materials.

**Tasks**:
1. Create `.zenflow/tasks/dojogenesis-com-mvp-a61a/report.md`:
   - Summary of what was implemented
   - Testing approach and results
   - Known issues or limitations
   - Biggest challenges encountered
   - Recommendations for V1
2. Update this plan.md with final status
3. Prepare handoff notes (if applicable)

**Deliverables**:
- [ ] report.md completed
- [ ] All plan.md steps marked complete
- [ ] Handoff notes prepared (if needed)

**Files Created**:
- `.zenflow/tasks/dojogenesis-com-mvp-a61a/report.md`

---

## Summary

**Total Steps**: 18 (including Technical Specification)  
**Completed**: 1 (Technical Specification)  
**Remaining**: 17

**Estimated Effort**: 6-8 hours of focused development time  
**Critical Path**: Project Setup → ChatKit Integration → Landing Page → Deployment

**Key Risks**:
- ChatKit API documentation may be incomplete or outdated
- Widget action handling may require trial and error
- DNS propagation may delay final verification

**Success Criteria**:
All steps completed, site live at https://dojogenesis.com, all verification checklists passed.

---

**Plan Created**: 2026-01-06  
**Last Updated**: 2026-01-06  
**Status**: Ready for Implementation
