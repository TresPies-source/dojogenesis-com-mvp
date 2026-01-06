# Bug Investigation: ChatKit Session Initialization Failure

## Bug Summary
ChatKit fails to start with error: `SyntaxError: Unexpected token 'I', "Internal S"... is not valid JSON`

The user sees an "Unable to Start Session" error page with the message about invalid JSON parsing.

## Root Cause Analysis

### Primary Issue
The frontend code assumes all API error responses will be JSON, but the backend can return non-JSON responses in certain error scenarios. This causes a JSON parsing error when the frontend tries to process the error.

**Location**: `components/ChatKitDemo.tsx:57-59`
```typescript
if (!response.ok) {
  const errorData: ErrorResponse = await response.json();  // ❌ Fails if response is not JSON
  throw new Error(errorData.message || 'Failed to create session');
}
```

### Contributing Factors

1. **OpenAI API Errors**: The OpenAI ChatKit API may return non-JSON error responses (like plain text "Internal Server Error")

2. **Network/Proxy Errors**: Infrastructure between the client and API (CDN, proxy, Cloudflare) might return HTML error pages (502 Bad Gateway, 503 Service Unavailable)

3. **Missing Error Handling**: The frontend lacks try-catch around `response.json()` calls for error responses

4. **Backend Error Handling**: While `app/api/chatkit/session/route.ts` attempts to return JSON errors, when OpenAI returns non-JSON content, that content may propagate to the frontend

## Affected Components

### Frontend
- **File**: `components/ChatKitDemo.tsx`
- **Lines**: 57-59 (error response parsing)
- **Issue**: No graceful handling for non-JSON error responses

### Backend
- **File**: `app/api/chatkit/session/route.ts`  
- **Lines**: 56-89 (error handling from OpenAI API)
- **Issue**: While it catches errors and returns JSON, OpenAI's raw error responses might not always be properly formatted

## Proposed Solution

### 1. Frontend Fix (Critical)
Add safe JSON parsing with fallback in `ChatKitDemo.tsx`:

```typescript
if (!response.ok) {
  let errorMessage = 'Failed to create session';
  try {
    const errorData: ErrorResponse = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (e) {
    // Response wasn't JSON, use default message or try to get text
    const text = await response.text().catch(() => '');
    if (text) {
      errorMessage = `Server error: ${text.substring(0, 100)}`;
    }
  }
  throw new Error(errorMessage);
}
```

### 2. Backend Enhancement (Recommended)
Ensure all error paths in `app/api/chatkit/session/route.ts` return properly formatted JSON, particularly when handling OpenAI API errors.

## Edge Cases to Consider

1. Empty response bodies
2. HTML error pages from infrastructure (502, 503, 504)
3. Non-English error messages
4. Extremely long error messages
5. Network timeouts
6. CORS errors (though less likely in this setup)

## Testing Strategy

1. **Unit Test**: Mock fetch to return non-JSON error responses
2. **Integration Test**: Test with invalid API key to trigger OpenAI errors
3. **Manual Test**: Verify error messages display correctly
4. **Edge Case Test**: Test with network disconnected, proxy errors

## Priority
**HIGH** - This is a user-facing error that completely blocks the ChatKit interface from loading.
