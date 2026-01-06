# DojoGenesis.com MVP - Technical Specification

## Overview

This document specifies the technical implementation of DojoGenesis.com MVP—a ChatKit-first web application that demonstrates the Dojo Protocol through an interactive, widget-driven experience.

**Stack Choice**: Next.js (App Router) + TypeScript, chosen for:
- Modern React patterns (Server Components, Server Actions)
- Built-in API routes for ChatKit session management
- Excellent Vercel deployment integration
- TypeScript for type safety with ChatKit SDK
- Different from Base44 (per requirements)
- Easily testable with Playwright
- High performance with App Router optimizations

## Architecture Overview

### Client/Server Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Landing Page (/)                                       │ │
│  │  - Hero section with copy                              │ │
│  │  - ChatKit React component (@openai/chatkit-react)     │ │
│  │  - Widget action handlers (widgets.onAction)           │ │
│  │  - DeviceId management (localStorage/cookie)           │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          │ API Calls                         │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                       SERVER                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/chatkit/session (POST)                           │ │
│  │  - Creates ChatKit session                             │ │
│  │  - Calls OpenAI ChatKit API                            │ │
│  │  - Returns session token                               │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/widget-action (POST)                             │ │
│  │  - Logs widget action events                           │ │
│  │  - Future-proofing for server-side action handling     │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          │ OpenAI API                        │
└──────────────────────────┼───────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ OpenAI      │
                    │ ChatKit API │
                    └─────────────┘
```

## Technology Stack

### Core Framework
- **Next.js 14+** (App Router)
- **TypeScript 5+**
- **React 18+**

### Styling & UI
- **TailwindCSS 3+** - Utility-first styling
- **shadcn/ui** - High-quality React components (Button, Card, Container, etc.)
- **Tailwind CSS variables** - Theme customization

### ChatKit Integration
- **@openai/chatkit-react** - Official React bindings
- **ChatKit Script Loader** - Client-side initialization

### Testing
- **Playwright** - E2E smoke tests
- **TypeScript** - Compile-time type checking

### Deployment
- **Cloudflare Pages** - Hosting and deployment (Next.js support with edge runtime)
- **GitHub** - Source control

## Routes and API Endpoints

### Frontend Routes

#### `/` (Landing Page)
- **Type**: Server Component (default)
- **Purpose**: Public landing page with ChatKit demo
- **Components**:
  - `Hero` - Value proposition and headline copy
  - `ChatKitDemo` - Client component wrapping ChatKit integration
  - `Footer` - Privacy statement and links

### API Routes

#### `POST /api/chatkit/session`
**Purpose**: Create a new ChatKit session server-side

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "device_abc123xyz"
}
```

**Server Implementation**:
```typescript
// Calls OpenAI ChatKit API
POST https://api.openai.com/v1/chatkit/sessions
Headers:
  Authorization: Bearer {OPENAI_API_KEY}
  OpenAI-Beta: chatkit_beta=v1
  Content-Type: application/json

Body:
{
  "workflow_id": "wf_69504ca5bd048190a8e10c1486defe7a07130d0df37f6b51",
  "user": "device_abc123xyz"
}
```

**Response** (Success - 200):
```json
{
  "session_token": "sk_session_...",
  "expires_at": "2026-01-07T00:00:00Z"
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to create ChatKit session",
  "message": "Detailed error message"
}
```

**Error Handling**:
- Network errors: Return 503 Service Unavailable
- Auth errors (invalid API key): Return 500 Internal Server Error (logged server-side)
- Rate limit errors: Return 429 Too Many Requests
- All errors logged server-side with context

#### `POST /api/widget-action`
**Purpose**: Log widget action events (future-proofing)

**Request Body**:
```json
{
  "action": "start_situation",
  "itemId": "widget_hello_agent",
  "userId": "device_abc123xyz",
  "timestamp": "2026-01-06T12:00:00Z"
}
```

**Response** (Success - 200):
```json
{
  "logged": true
}
```

**Implementation**: Simple console logging in MVP; structure for future analytics.

## Data Handling

### Device ID Management

**Purpose**: Maintain stable user identity across sessions without authentication

**Implementation Strategy**:
1. **Check localStorage** on component mount
2. **Generate UUID** if not present: `crypto.randomUUID()`
3. **Store in localStorage** with key `dojo_device_id`
4. **Fallback to cookie** if localStorage unavailable
5. **Pass to ChatKit** as `user` parameter in session creation

**Code Reference**:
```typescript
// lib/device-id.ts
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  const STORAGE_KEY = 'dojo_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  
  return deviceId;
}
```

### Session Data

No persistent storage in MVP. All conversation state is managed by ChatKit sessions.

## Environment Variables

### Required Variables

```bash
# OpenAI API Key (server-side only)
OPENAI_API_KEY=sk-proj-...

# Optional: Custom domain configuration
NEXT_PUBLIC_SITE_URL=https://dojogenesis.com

# Optional: Rate limiting (future)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### Variable Access Rules
- **OPENAI_API_KEY**: Server-side only (API routes)
- **NEXT_PUBLIC_*** variables: Can be accessed client-side
- **Never** expose API keys in client bundles or public code

### .env.example
```bash
# Copy this file to .env.local and fill in your values
# NEVER commit .env.local to version control

# OpenAI API Key - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_api_key_here

# Site URL (optional, defaults to localhost in development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## ChatKit Integration Details

### Session Creation Flow

1. **Client**: Component mounts, calls `getOrCreateDeviceId()`
2. **Client**: Sends POST to `/api/chatkit/session` with `userId`
3. **Server**: Validates request, calls OpenAI ChatKit API
4. **Server**: Returns session token to client
5. **Client**: Initializes ChatKit with session token
6. **Client**: ChatKit loads workflow and renders Hello Agent widget

### ChatKit React Integration

```typescript
// components/ChatKitDemo.tsx
import { ChatKit } from '@openai/chatkit-react';
import { useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '@/lib/device-id';

export function ChatKitDemo() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initSession() {
      try {
        const deviceId = getOrCreateDeviceId();
        const response = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: deviceId }),
        });

        if (!response.ok) {
          throw new Error('Failed to create session');
        }

        const data = await response.json();
        setSessionToken(data.session_token);
      } catch (err) {
        setError('Unable to start chat. Please refresh the page.');
        console.error('Session creation failed:', err);
      }
    }

    initSession();
  }, []);

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!sessionToken) {
    return <div className="loading-state">Loading chat...</div>;
  }

  return <ChatKit sessionToken={sessionToken} />;
}
```

### Widget Action Handling

**Client-Side Handler**:
```typescript
// In ChatKitDemo component
useEffect(() => {
  if (window.widgets) {
    window.widgets.onAction((action, itemId) => {
      // Log to server (optional in MVP)
      fetch('/api/widget-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action.type,
          itemId,
          userId: getOrCreateDeviceId(),
          timestamp: new Date().toISOString(),
        }),
      });

      // Map action to behavior (see ACTIONS_MAP.md)
      handleWidgetAction(action.type, itemId);
    });
  }
}, []);
```

## Widget Specification

See `/docs/chatkit/HELLO_WIDGET_OPTION_A.json` for full JSON specification.

**Widget Type**: Card with Title, Text, and Buttons

**Actions Defined**:
- `start_situation` - "Start with a real situation"
- `add_perspectives` - "Add 3 perspectives"
- `show_example` - "Show me an example"
- `help_frame` - "I'm stuck—help me frame it"
- `generate_move` - "Generate a next move"
- `pick_output` - "Pick an output" (optional)

See `/docs/chatkit/ACTIONS_MAP.md` for action → behavior mapping.

## Error Handling and Observability

### Error Categories

1. **Session Creation Errors**
   - **Cause**: OpenAI API down, invalid API key, network issues
   - **Handling**: Display friendly error message, log server-side
   - **User Message**: "Unable to start chat. Please refresh the page or try again later."

2. **ChatKit Runtime Errors**
   - **Cause**: Widget rendering issues, script loading failures
   - **Handling**: Graceful fallback UI
   - **User Message**: "Chat is temporarily unavailable. Please refresh the page."

3. **Widget Action Errors**
   - **Cause**: Invalid action configuration, network errors on logging
   - **Handling**: Continue user flow, log error (don't block UX)
   - **User Message**: None (silent failure for logging)

### Logging Strategy (MVP)

**Server-Side**:
```typescript
// Simple console logging with structured data
console.error('[ChatKit Session Error]', {
  timestamp: new Date().toISOString(),
  error: error.message,
  userId: userId,
});
```

**Client-Side**:
```typescript
// Console errors for debugging
console.error('[Widget Action Error]', { action, itemId, error });
```

**Future**: Integrate with Vercel Analytics, Sentry, or similar service.

### Health Checks

- **Manual**: Visit `/` and confirm chat loads
- **Automated**: Playwright test verifies chat container mounts
- **Monitoring**: Vercel deployment logs for 5xx errors

## Security Notes

### Secrets Management
- ✅ **DO**: Store API keys in environment variables
- ✅ **DO**: Use `.env.local` for local development (git-ignored)
- ✅ **DO**: Configure secrets in Vercel dashboard for production
- ❌ **DON'T**: Commit any `.env` files with real values
- ❌ **DON'T**: Expose `OPENAI_API_KEY` to client-side code
- ❌ **DON'T**: Log API keys or session tokens

### Input Validation
- Validate `userId` format (UUID) in `/api/chatkit/session`
- Sanitize any user inputs before logging
- Rate limiting headers (future consideration)

### CORS and Headers
- API routes restricted to same-origin by default
- No CORS configuration needed in MVP (same domain)

### Dependencies
- Run `npm audit` before deployment
- Keep Next.js and dependencies up to date
- No known vulnerabilities in production build

## Deployment

### Cloudflare Pages Configuration

**Why Cloudflare Pages**:
- Full Next.js support including App Router and API routes
- Edge runtime for serverless functions (API routes)
- Free tier with unlimited requests and bandwidth
- Fast global CDN with 300+ locations
- Automatic HTTPS with custom domains
- GitHub integration with preview deployments

**Build Settings**:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Node Version**: 18 or 20
- **Runtime**: Next.js on Pages (automatic detection)

**Environment Variables** (set in Cloudflare Pages dashboard):
- `OPENAI_API_KEY` (secret, encrypted)
- `NEXT_PUBLIC_SITE_URL` (optional)
- `NODE_VERSION=20` (optional, defaults to 18)

**Custom Domain**:
1. Add `dojogenesis.com` in Cloudflare Pages → Custom Domains
2. If domain managed by Cloudflare DNS: automatic configuration
3. If external DNS: Add CNAME record pointing to Cloudflare Pages
4. SSL certificate auto-provisioned (immediate)

### GitHub Integration

- **Repository**: Link GitHub repo to Cloudflare Pages project
- **Branch**: `main` → production deployment
- **Pull Requests**: Automatic preview deployments (preview-*.pages.dev)

### Deployment Steps

1. **Prepare Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DojoGenesis.com MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dojogenesis-com-mvp.git
   git push -u origin main
   ```

2. **Create Cloudflare Pages Project**:
   - Visit [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Workers & Pages → Create → Pages → Connect to Git
   - Authorize GitHub and select repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `.next`
     - **Framework preset**: Next.js (auto-detected)

3. **Configure Environment Variables**:
   - In Cloudflare Pages project settings → Environment Variables
   - Add `OPENAI_API_KEY` (production environment)
   - Mark as encrypted (secret)
   - Add same variable for preview environment if needed

4. **Deploy**:
   ```bash
   git push origin main
   # Cloudflare Pages auto-deploys on push to main
   ```

5. **Verify Deployment**:
   - Visit deployment URL (*.pages.dev)
   - Test chat initialization
   - Check Cloudflare Pages logs for errors
   - Test API routes (/api/chatkit/session)

6. **Connect Custom Domain**:
   - Cloudflare Pages Dashboard → Custom Domains → Add domain
   - Enter `dojogenesis.com`
   - If using Cloudflare DNS: Click "Activate Domain" (automatic setup)
   - If external DNS: Add CNAME record: `dojogenesis.com` → `your-project.pages.dev`
   - SSL provisioning is immediate (Cloudflare Universal SSL)

### Cloudflare Pages Configuration File (Optional)

Create `wrangler.toml` for advanced configuration:

```toml
name = "dojogenesis-com-mvp"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
```

### Alternative: Wrangler CLI Deployment

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy directly
wrangler pages deploy .next --project-name=dojogenesis-com-mvp
```

## Test Plan

### Automated Tests

#### Playwright Smoke Test
**File**: `tests/smoke.spec.ts`

**Test Cases**:
1. **Page loads successfully**
   - Navigate to `/`
   - Assert page title contains "Dojo Genesis"
   - Assert no console errors

2. **Chat container mounts**
   - Wait for chat container element
   - Assert container is visible
   - Assert loading state appears (before session ready)

3. **Session creation succeeds** (optional in MVP)
   - Mock `/api/chatkit/session` response
   - Verify ChatKit component receives token

**Run Command**:
```bash
npm run test:e2e
```

### Manual Testing Checklist

**Pre-Deployment**:
- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Run `npm run type-check` with no errors (if configured)
- [ ] Run Playwright smoke test

**Post-Deployment**:
- [ ] Visit DojoGenesis.com and verify page loads
- [ ] Verify chat interface appears within 3 seconds
- [ ] Click each button in Hello Agent widget
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Verify error state by disabling network mid-session
- [ ] Check Vercel logs for any 5xx errors

### Performance Testing

**Lighthouse Audit** (target: > 85):
```bash
npm run lighthouse # or use Chrome DevTools
```

**Key Metrics**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

## File Structure

```
dojogenesis-com-mvp/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page (/)
│   ├── api/
│   │   ├── chatkit/
│   │   │   └── session/
│   │   │       └── route.ts       # POST /api/chatkit/session
│   │   └── widget-action/
│   │       └── route.ts           # POST /api/widget-action
│   └── globals.css                # Tailwind imports
├── components/
│   ├── ChatKitDemo.tsx            # ChatKit integration component
│   ├── Hero.tsx                   # Landing page hero
│   ├── Footer.tsx                 # Footer with privacy statement
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/
│   ├── device-id.ts               # Device ID management
│   ├── utils.ts                   # Utility functions (cn, etc.)
│   └── chatkit-actions.ts         # Widget action handlers
├── docs/
│   ├── PRD_DOJOGENESIS_MVP.md
│   ├── TECH_SPEC_DOJOGENESIS_MVP.md
│   └── chatkit/
│       ├── HELLO_WIDGET_OPTION_A.json
│       └── ACTIONS_MAP.md
├── tests/
│   └── smoke.spec.ts              # Playwright smoke test
├── public/
│   └── (static assets)
├── .env.example                   # Environment variable template
├── .gitignore                     # Ignore .env.local, node_modules, etc.
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── playwright.config.ts
└── README.md
```

## Source Code Files to Create/Modify

### New Files (Implementation Phase)

**Configuration**:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind customization
- `next.config.js` - Next.js configuration
- `playwright.config.ts` - Playwright test configuration
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore rules

**Application Code**:
- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Landing page
- `app/globals.css` - Global styles and Tailwind
- `app/api/chatkit/session/route.ts` - Session API
- `app/api/widget-action/route.ts` - Widget action API
- `components/ChatKitDemo.tsx` - ChatKit wrapper
- `components/Hero.tsx` - Hero section
- `components/Footer.tsx` - Footer
- `lib/device-id.ts` - Device ID utilities
- `lib/utils.ts` - Utility functions
- `lib/chatkit-actions.ts` - Action handlers

**UI Components** (via shadcn/ui CLI):
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- Additional components as needed

**Tests**:
- `tests/smoke.spec.ts` - Playwright smoke test

**Documentation** (already created):
- `docs/PRD_DOJOGENESIS_MVP.md`
- `docs/TECH_SPEC_DOJOGENESIS_MVP.md`
- `docs/chatkit/HELLO_WIDGET_OPTION_A.json`
- `docs/chatkit/ACTIONS_MAP.md`

## References

- https://platform.openai.com/docs/guides/chatkit
- https://platform.openai.com/docs/guides/chatkit-widgets
- https://platform.openai.com/docs/guides/chatkit-actions
- https://platform.openai.com/docs/api-reference/chatkit
- https://widgets.chatkit.studio/icons
- https://widgets.chatkit.studio/components/button

---

**Document Status**: Implementation Ready  
**Last Updated**: 2026-01-06  
**Complexity Assessment**: Hard (Complex architecture, ChatKit integration, widget system)
