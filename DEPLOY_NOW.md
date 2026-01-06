# Deploy DojoGenesis.com MVP to Cloudflare Pages - Quick Start

**Time Required**: 10-15 minutes

---

## Quick Steps

### 1. Create GitHub Repository (2 minutes)
1. Go to https://github.com/new
2. Name: `dojogenesis-com-mvp`
3. Visibility: Public or Private
4. Click "Create repository"

### 2. Push Code (1 minute)
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/dojogenesis-com-mvp.git

# Commit any pending changes
git add .
git commit -m "Ready for Cloudflare Pages deployment"

# Push to GitHub
git push -u origin dojogenesis-com-mvp-a61a
```

### 3. Create Cloudflare Pages Project (5 minutes)
1. Visit https://dash.cloudflare.com
2. Workers & Pages → Create → Pages → Connect to Git
3. Authorize GitHub and select `dojogenesis-com-mvp`
4. Configure build:
   - **Framework**: Next.js (SSR)
   - **Build command**: `npm run build`
   - **Build output**: `.next`
5. Add environment variables:
   - `OPENAI_API_KEY` = `your-actual-api-key` (Production)
   - `NODE_VERSION` = `20` (Production)
6. Click "Save and Deploy"

### 4. Wait for Build (2-3 minutes)
- Watch build logs
- Build should complete successfully
- Note your deployment URL: `dojogenesis-xyz.pages.dev`

### 5. Test Deployment (2 minutes)
1. Visit your `*.pages.dev` URL
2. Verify chat initializes
3. Click a widget button (e.g., "Show me an example")
4. Send a test message

---

## ✅ Success Criteria
- [ ] Site loads at Cloudflare Pages URL
- [ ] Chat interface works
- [ ] Widget buttons respond
- [ ] No errors in browser console

---

## 🚨 If Something Breaks
See `DEPLOYMENT_CLOUDFLARE.md` → Troubleshooting section

---

## Next Steps (Optional)
- Configure custom domain `dojogenesis.com` (see full guide)
- Set up monitoring/analytics
- Run Lighthouse audit on production URL

---

**Full Documentation**: See `DEPLOYMENT_CLOUDFLARE.md`
