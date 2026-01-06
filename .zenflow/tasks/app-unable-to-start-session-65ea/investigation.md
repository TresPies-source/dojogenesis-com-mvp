# Bug Investigation: App Unable to Start Session

**Date**: January 6, 2026  
**Status**: Root cause identified  
**Priority**: High - Production blocking issue

---

## Bug Summary

The deployed application at Cloudflare Pages fails to create a session with error:
```
Session initialization failed: Error: Failed to create session
```

**User Impact**: Complete application failure - users cannot use the chat interface at all.

---

## Root Cause Analysis

After thorough investigation, the root cause is a **deployment configuration mismatch**:

### 1. **Incorrect Build Configuration for Cloudflare Pages**

**Current setup (INCORRECT)**:
- Build command: `npm run build` 
- Output directory: `.next`
- Uses standard Next.js build which is NOT compatible with Cloudflare Pages Edge Runtime

**Required setup (CORRECT)**:
- Build command: `npm run pages:build` (uses `@cloudflare/next-on-pages`)
- Output directory: `.vercel/output/static` (as specified in wrangler.toml)
- Builds for Cloudflare Workers/Pages Edge Runtime

**Why this causes the error**:
- Standard Next.js build uses Node.js runtime features incompatible with Cloudflare Workers
- Environment variable access via `getRequestContext()` from `@cloudflare/next-on-pages` only works with proper build
- The API route `/api/chatkit/session` cannot access `OPENAI_API_KEY` when built incorrectly

### 2. **Deprecated Build Tooling**

The project uses `@cloudflare/next-on-pages@1.13.16` which is **deprecated** as of December 2025. The package maintainers recommend migrating to `@opennextjs/cloudflare` adapter.

**Impact**: Using deprecated tooling may cause compatibility issues and won't receive future updates.

### 3. **Environment Variable Access Pattern**

In `app/api/chatkit/session/route.ts:23-27`:
```typescript
try {
  const { env } = getRequestContext();
  apiKey = env.OPENAI_API_KEY;
} catch {
  apiKey = process.env.OPENAI_API_KEY;
}
```

This pattern assumes:
- `getRequestContext()` is available (only works with proper Cloudflare Pages build)
- `env.OPENAI_API_KEY` is set in Cloudflare Pages dashboard (Production environment)
- Falls back to `process.env` for local development

If the build is incorrect, `getRequestContext()` throws and `process.env.OPENAI_API_KEY` is undefined in production, causing the API key check to fail at line 29-38.

---

## Affected Components

1. **API Route**: `app/api/chatkit/session/route.ts`
   - Cannot access OpenAI API key
   - Returns 500 error to client

2. **Client Component**: `components/ChatKitDemo.tsx:49-60`
   - Receives error response from session API
   - Displays "Unable to Start Session" error screen

3. **Cloudflare Pages Configuration**
   - Wrong build command in deployment settings
   - Wrong build output directory configured
   - Environment variables may not be properly bound to Edge Runtime

---

## Proposed Solution

### Option A: Fix Current Setup (Quick Fix)
1. Update Cloudflare Pages build settings:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
2. Verify `OPENAI_API_KEY` environment variable is set for Production environment
3. Redeploy and test

**Pros**: Minimal code changes, quick deployment  
**Cons**: Uses deprecated tooling, may have future compatibility issues

### Option B: Migrate to OpenNext Adapter (Recommended)
1. Replace `@cloudflare/next-on-pages` with `@opennextjs/cloudflare`
2. Update build scripts to use `npx opennextjs-cloudflare build`
3. Update environment variable access pattern if needed
4. Update deployment configuration
5. Test and deploy

**Pros**: Modern, supported tooling; better long-term maintainability  
**Cons**: Requires more testing and code changes

---

## Recommended Immediate Action

**Use Option A (Quick Fix)** to unblock users immediately:

1. **Update Cloudflare Pages Build Configuration**:
   - Go to Cloudflare Pages Dashboard → Project Settings → Builds & deployments
   - Change build command from `npm run build` to `npm run pages:build`
   - Change build output directory from `.next` to `.vercel/output/static`
   - Save and trigger new deployment

2. **Verify Environment Variable**:
   - Go to Settings → Environment variables
   - Confirm `OPENAI_API_KEY` is set for **Production** environment
   - Value should start with `sk-proj-`

3. **Update Documentation**:
   - Fix `DEPLOYMENT_CLOUDFLARE.md` with correct build settings
   - Fix `DEPLOYMENT_STATUS.md` with correct build settings

4. **Test Deployment**:
   - Wait for build to complete
   - Visit deployed URL
   - Verify session initialization succeeds
   - Test chat functionality

5. **Plan Migration to OpenNext** (future task, non-blocking):
   - Create separate task for migrating to `@opennextjs/cloudflare`
   - Schedule for next maintenance window

---

## Testing Plan

### Local Testing (Limited due to Windows)
- Cannot fully test `pages:build` on Windows (requires WSL)
- Verify standard `npm run build` still works for local development
- Verify environment variable fallback works locally

### Deployment Testing
1. Build succeeds in Cloudflare Pages
2. Session API returns valid session token (check logs)
3. ChatKit initializes successfully
4. Widget interactions work
5. No console errors in browser
6. API route logging shows successful OpenAI API calls

---

## Edge Cases & Side Effects

1. **Local Development**: Still uses `npm run dev` with `process.env.OPENAI_API_KEY` - no changes needed
2. **Other API Routes**: Widget action logging route (`/api/widget-action`) doesn't use env vars - unaffected
3. **Staging Environments**: If Preview environment is used, must also set `OPENAI_API_KEY` there
4. **Rate Limiting**: After fix, users can create sessions - monitor OpenAI API usage

---

## Related Files

- `app/api/chatkit/session/route.ts` - Session creation API
- `components/ChatKitDemo.tsx` - Client-side session initialization
- `package.json` - Build scripts
- `next.config.js` - Next.js configuration
- `wrangler.toml` - Cloudflare Pages configuration
- `env.d.ts` - TypeScript environment variable definitions
- `.env.example` - Environment variable documentation
- `DEPLOYMENT_CLOUDFLARE.md` - Deployment guide (needs update)
- `DEPLOYMENT_STATUS.md` - Deployment status (needs update)

---

## Implementation Notes

- The session initialization happens in `ChatKitDemo.tsx` useEffect on mount
- Error is caught and displayed with user-friendly message
- "Try Again" button reloads the page to retry
- Browser console shows full error stack for debugging
- Server-side logs in Cloudflare Pages should show API key availability and OpenAI API response

---

## Verification Checklist

After implementing fix:
- [ ] Cloudflare Pages build succeeds (check build logs)
- [ ] No errors about missing `OPENAI_API_KEY` in server logs
- [ ] Session API returns 200 response with session token
- [ ] ChatKit interface loads and renders
- [ ] Can send messages and receive responses
- [ ] Widget buttons work correctly
- [ ] No console errors in browser DevTools
- [ ] Error handling still works if OpenAI API is unavailable
- [ ] Documentation updated with correct build commands
