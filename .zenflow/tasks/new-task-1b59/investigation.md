# Bug Investigation: OpenAI API Key Not Being Used

## Bug Summary
- **Symptom**: Session initialization fails completely in the app
- **User Report**: OpenAI dashboard shows API key has never been used
- **Impact**: Users cannot create or start chat sessions

## Root Cause Analysis

### Problem Location
`app/api/chatkit/session/route.ts:19`

### Technical Issue
The code is using `process.env.OPENAI_API_KEY` in an Edge runtime environment on Cloudflare Pages:

```typescript
export const runtime = 'edge';
// ...
const apiKey = process.env.OPENAI_API_KEY;
```

**This does not work on Cloudflare Pages.** When using `@cloudflare/next-on-pages` with Edge runtime, environment variables are NOT accessible via `process.env`. Instead, they must be accessed through the Cloudflare request context.

### Why This Fails
- Cloudflare Pages uses Workers runtime for Edge functions
- In Workers runtime, environment variables are bound to the request context, not `process.env`
- The code always gets `undefined` for `apiKey`, triggering the error handler at line 22-29
- Since the API key is `undefined`, no OpenAI API calls are ever made
- This explains why the OpenAI dashboard shows zero usage

## Affected Components
- **Primary**: `app/api/chatkit/session/route.ts` - Session creation endpoint
- **Secondary**: `components/ChatKitDemo.tsx` - Displays error to users when session fails

## Proposed Solution

### Fix Required
Replace `process.env.OPENAI_API_KEY` with Cloudflare-specific environment access:

```typescript
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function POST(request: NextRequest) {
  const { env } = getRequestContext();
  const apiKey = env.OPENAI_API_KEY;
  // ... rest of the code
}
```

### Why This Works
- `getRequestContext()` provides access to Cloudflare's request context
- The `env` property contains all environment variables set in Cloudflare Pages dashboard
- This is the documented approach for accessing environment variables in `@cloudflare/next-on-pages`

## Edge Cases Considered
- Local development: `getRequestContext()` may not be available locally, need to handle gracefully
- Type safety: Need to add type definitions for the environment variables
- Error handling: Existing error handling (lines 21-30) is good and should be preserved

## References
- Package in use: `@cloudflare/next-on-pages` v1.13.16 (from package.json)
- Runtime: Edge (explicitly set on line 3)
- Deployment: Cloudflare Pages (confirmed by wrangler.toml)

---

## Implementation Notes

### Changes Made
**File**: `app/api/chatkit/session/route.ts`

1. Added import: `import { getRequestContext } from '@cloudflare/next-on-pages';`
2. Replaced direct `process.env.OPENAI_API_KEY` access with Cloudflare-aware approach:
   ```typescript
   let apiKey: string | undefined;
   
   try {
     const { env } = getRequestContext();
     apiKey = env.OPENAI_API_KEY;
   } catch {
     apiKey = process.env.OPENAI_API_KEY;
   }
   ```

### Why This Works
- On Cloudflare Pages (production), `getRequestContext().env.OPENAI_API_KEY` will successfully retrieve the environment variable
- In local development, if `getRequestContext()` throws, it falls back to `process.env`
- Existing error handling at lines 29-37 remains intact and will still catch missing API keys
- The API key will now be properly passed to OpenAI API calls

### Expected Outcome
- OpenAI API key will be correctly retrieved from Cloudflare environment variables
- Session initialization will succeed
- OpenAI dashboard will show API usage
- Users can create and start chat sessions
