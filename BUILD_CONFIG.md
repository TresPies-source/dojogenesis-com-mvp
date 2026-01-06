# Build Configuration Reference

**Single Source of Truth for all build configurations**

---

## Cloudflare Pages Build Configuration

### Production Build Settings

```
Framework preset:     Next.js (SSR)
Build command:        npm run pages:build
Build output:         .vercel/output/static
Root directory:       / (leave blank)
Node version:         20
```

### Environment Variables

**Required for Production:**
- `OPENAI_API_KEY` - OpenAI API key with ChatKit access (starts with `sk-proj-` or `sk-`)
- `NODE_VERSION` - Set to `20`

**Important**: Environment variables must be set for the **Production** environment in Cloudflare Pages dashboard.

---

## Local Development Build

### Development Server

```bash
npm run dev
```

- Uses Next.js development server with hot reload
- Reads environment variables from `.env.local`
- Runs on `http://localhost:3000`
- Does not require Cloudflare-specific build

### Local Environment Setup

Create `.env.local` file:
```env
OPENAI_API_KEY=sk-proj-your-key-here
```

**Security**: `.env.local` is git-ignored and should never be committed.

---

## Build Commands Reference

| Command | Purpose | Output | Use Case |
|---------|---------|--------|----------|
| `npm run dev` | Development server | None (dev mode) | Local development |
| `npm run build` | Standard Next.js build | `.next/` | Local production testing (NOT for Cloudflare) |
| `npm run pages:build` | Cloudflare Pages build | `.vercel/output/static` | Cloudflare Pages deployment |
| `npm start` | Run production build | None (server) | Local production testing |
| `npm run lint` | ESLint check | None | Code quality |
| `npm run test:e2e` | Playwright tests | None | E2E testing |

---

## Cloudflare Pages Adapter

### Current Implementation

Uses `@cloudflare/next-on-pages@1.13.16` for Cloudflare Workers/Pages Edge Runtime compatibility.

**Note**: This package is deprecated. See Migration section below.

### How It Works

1. `npm run pages:build` calls `npx @cloudflare/next-on-pages`
2. Adapter transforms Next.js build for Cloudflare Edge Runtime
3. Output goes to `.vercel/output/static` (configured in `wrangler.toml`)
4. Enables `getRequestContext()` for accessing Cloudflare environment variables

### Key Files

- `package.json` - Defines `pages:build` script
- `wrangler.toml` - Specifies output directory
- `next.config.js` - Next.js configuration (output: 'standalone')
- `env.d.ts` - TypeScript definitions for CloudflareEnv

---

## Environment Variable Access Pattern

### In Cloudflare Pages (Production)

```typescript
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

try {
  const { env } = getRequestContext();
  const apiKey = env.OPENAI_API_KEY;
} catch {
  // Fallback for development
  const apiKey = process.env.OPENAI_API_KEY;
}
```

### In Local Development

```typescript
const apiKey = process.env.OPENAI_API_KEY;
```

---

## Directory Structure

```
project/
├── .next/                    # Standard Next.js build output (not used for Cloudflare)
├── .vercel/
│   └── output/
│       └── static/          # Cloudflare Pages build output (used)
├── app/                     # Next.js app directory
│   └── api/                # Edge runtime API routes
├── components/             # React components
├── lib/                   # Utility functions
├── public/               # Static assets
├── .env.local           # Local environment variables (git-ignored)
├── .env.example        # Example environment variables
├── next.config.js     # Next.js configuration
├── wrangler.toml     # Cloudflare configuration
└── package.json     # Dependencies and scripts
```

---

## Build Output Details

### `.vercel/output/static` Structure

Created by `@cloudflare/next-on-pages`:

```
.vercel/output/static/
├── _worker.js           # Cloudflare Worker entry point
├── _routes.json        # Routing configuration
├── _headers            # HTTP headers
└── [static assets]    # Images, CSS, JS bundles
```

This structure is compatible with Cloudflare Pages and Workers Edge Runtime.

---

## Troubleshooting Build Issues

### Issue: Build fails with "getRequestContext is not a function"

**Cause**: Using wrong build command (`npm run build` instead of `npm run pages:build`)

**Solution**: 
- Verify Cloudflare Pages build command is set to `npm run pages:build`
- Verify build output directory is `.vercel/output/static`

### Issue: Environment variables not accessible in production

**Cause**: Variables not set correctly in Cloudflare dashboard or wrong environment selected

**Solution**:
- Go to Cloudflare Pages → Settings → Environment variables
- Verify `OPENAI_API_KEY` exists for **Production** environment
- Redeploy after adding/updating variables

### Issue: Windows build fails with WSL error

**Cause**: `@cloudflare/next-on-pages` uses Vercel CLI which may have issues on Windows

**Solution**:
- Don't run `npm run pages:build` locally on Windows
- Let Cloudflare Pages handle the build
- Use `npm run dev` for local development

---

## Migration Path (Future)

### Current: @cloudflare/next-on-pages (Deprecated)

```json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.16"
  }
}
```

### Recommended: @opennextjs/cloudflare (Future)

When ready to migrate:

1. Install new adapter:
```bash
npm uninstall @cloudflare/next-on-pages
npm install @opennextjs/cloudflare
```

2. Update build script in `package.json`:
```json
{
  "scripts": {
    "pages:build": "npx opennextjs-cloudflare build"
  }
}
```

3. Test locally:
```bash
npx wrangler dev
```

4. Update Cloudflare Pages build command (no change needed if using `pages:build`)

5. Test deployment

**Note**: This migration is non-critical and should be done during a maintenance window.

---

## Quick Reference

### To deploy to Cloudflare Pages:
1. Set build command to `npm run pages:build`
2. Set output directory to `.vercel/output/static`
3. Add `OPENAI_API_KEY` to Production environment
4. Deploy

### To develop locally:
1. Create `.env.local` with `OPENAI_API_KEY`
2. Run `npm run dev`
3. Open `http://localhost:3000`

### To verify build configuration:
- Check `package.json` → `scripts.pages:build`
- Check `wrangler.toml` → `pages_build_output_dir`
- Check Cloudflare Pages dashboard → Settings → Builds & deployments

---

**Last Updated**: January 6, 2026  
**Applies To**: DojoGenesis.com MVP v0.1.0
