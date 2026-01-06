# Deployment Guide

**Complete guide for deploying DojoGenesis.com MVP to Cloudflare Pages**

> **Quick Reference**: See [BUILD_CONFIG.md](./BUILD_CONFIG.md) for build configuration details

## Prerequisites

- [x] Code built successfully (`npm run build`)
- [ ] GitHub account with repository created
- [ ] Cloudflare account (free tier is sufficient)
- [ ] OpenAI API key for production environment
- [ ] Domain `dojogenesis.com` (if using custom domain)

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - **Name**: `dojogenesis-com-mvp` (or your preferred name)
   - **Visibility**: Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

---

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dojogenesis-com-mvp.git

# Commit any pending changes (if needed)
git add .
git commit -m "Ready for Cloudflare Pages deployment"

# Push to GitHub
git push -u origin dojogenesis-com-mvp-a61a
```

**Verify**: Visit your GitHub repository URL and confirm all files are visible.

---

## Step 3: Create Cloudflare Pages Project

1. **Log in to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Sign in or create a free account

2. **Navigate to Pages**
   - Click "Workers & Pages" in the left sidebar
   - Click "Create" button
   - Select "Pages" tab
   - Click "Connect to Git"

3. **Connect GitHub**
   - Click "Connect GitHub"
   - Authorize Cloudflare Pages to access your GitHub account
   - Select your repository: `dojogenesis-com-mvp`
   - Click "Begin setup"

4. **Configure Build Settings**
   ```
   Project name:         dojogenesis
   Production branch:    dojogenesis-com-mvp-a61a (or main)
   Framework preset:     Next.js (SSR)
   Build command:        npm run pages:build
   Build output directory: .vercel/output/static
   Root directory:       / (leave blank)
   ```

5. **Environment Variables (Critical)**
   - Click "Add variable" under Environment Variables
   - Add the following:
   
   | Variable Name     | Value                          | Environment |
   |-------------------|--------------------------------|-------------|
   | `OPENAI_API_KEY`  | `sk-proj-...` (your actual key)| Production  |
   | `NODE_VERSION`    | `20`                           | Production  |

   **IMPORTANT**: Ensure "Production" environment is selected for `OPENAI_API_KEY`.

6. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-3 minutes for initial deployment
   - Watch build logs for any errors

---

## Step 4: Verify Deployment

1. **Check Build Success**
   - Build should complete with "Success" status
   - No errors in build logs
   - Deployment URL shown (e.g., `dojogenesis-abc.pages.dev`)

2. **Test the Deployed Site**
   - Click the deployment URL
   - Verify:
     - [ ] Page loads quickly (< 3 seconds)
     - [ ] Hero section displays correctly
     - [ ] Chat interface initializes
     - [ ] Widget buttons are visible
     - [ ] Click a widget button (e.g., "Show me an example")
     - [ ] Chat sends/receives messages

3. **Check for Errors**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests
   - Verify `/api/chatkit/session` returns 200 status

---

## Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain in Cloudflare Pages**
   - Go to your Cloudflare Pages project
   - Click "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter: `dojogenesis.com`

2. **DNS Configuration**

   **Option A: Using Cloudflare DNS (Recommended)**
   - If your domain is already on Cloudflare:
     - Click "Activate Domain"
     - Cloudflare automatically creates CNAME records
     - SSL provisioned immediately

   **Option B: Using External DNS**
   - If your domain is not on Cloudflare:
     - Add CNAME record at your DNS provider:
       ```
       Type:  CNAME
       Name:  @ (or dojogenesis.com)
       Value: dojogenesis-abc.pages.dev (your Cloudflare Pages URL)
       TTL:   Auto or 300
       ```
     - Wait for DNS propagation (up to 48 hours, usually < 15 minutes)

3. **Verify Custom Domain**
   - Visit https://dojogenesis.com
   - Confirm SSL certificate is active (padlock icon in browser)
   - Test full user flow

---

## Step 6: Post-Deployment Verification

### Functionality Tests
- [ ] Site loads at production URL
- [ ] Chat initializes successfully
- [ ] All 6 widget buttons work:
  - [ ] "Start with a real situation"
  - [ ] "Add 3 perspectives"
  - [ ] "Show me an example"
  - [ ] "I'm stuck—help me frame it"
  - [ ] "Generate a next move"
  - [ ] "Pick an output" (if visible)
- [ ] Messages send/receive correctly
- [ ] Error handling works (test with network throttling)

### Browser Testing
- [ ] Desktop Chrome (latest)
- [ ] Desktop Firefox (latest)
- [ ] Desktop Safari (latest, macOS only)
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome

### Performance Tests
- [ ] Run Lighthouse audit in Chrome DevTools
  - Performance score > 85
  - Accessibility score > 90
  - Best Practices score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

---

## Troubleshooting

### Build Fails with "Module not found"
- **Solution**: Ensure all dependencies in `package.json` are correct
- Run locally: `rm -rf node_modules package-lock.json && npm install && npm run build`
- Commit updated `package-lock.json` and push

### Chat Doesn't Initialize
- **Check**: Environment variable `OPENAI_API_KEY` is set in Cloudflare Pages dashboard
- **Check**: API key is valid and has ChatKit access
- **Check**: Browser console for errors from `/api/chatkit/session`
- **Check**: Cloudflare Pages Functions logs for API errors

### 500 Error on /api/chatkit/session
- **Check**: `OPENAI_API_KEY` environment variable is set correctly
- **Check**: API key has not expired
- **Check**: OpenAI API status at https://status.openai.com
- **View Logs**: Cloudflare Pages dashboard → Functions → Logs

### Custom Domain Not Working
- **Check**: DNS records propagated (use https://dnschecker.org)
- **Check**: CNAME points to correct `*.pages.dev` URL
- **Check**: SSL certificate provisioned (may take 5-10 minutes)
- **Try**: Clear browser cache and retry

### Widget Buttons Don't Respond
- **Check**: Browser console for JavaScript errors
- **Check**: ChatKit script loaded (Network tab in DevTools)
- **Check**: `window.widgets.onAction` handler registered
- **Test**: Try in incognito/private browsing mode

---

## Continuous Deployment

Cloudflare Pages automatically deploys on every push to your production branch.

**Workflow**:
1. Make code changes locally
2. Test locally: `npm run dev`
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
4. Cloudflare Pages automatically:
   - Detects push
   - Runs build
   - Deploys to production
   - Updates live site in 2-3 minutes

**View Deployments**:
- Cloudflare Pages dashboard → Your Project → Deployments
- See all builds, rollback to previous versions if needed

---

## Monitoring and Logs

### Cloudflare Pages Dashboard
- **Analytics**: Real-time traffic, bandwidth, requests
- **Functions Logs**: API route errors and debugging
- **Build Logs**: Deployment history and build output

### Recommended External Tools
- **Sentry**: Error tracking and monitoring (optional)
- **PostHog**: Product analytics (optional)
- **Uptime Robot**: Site uptime monitoring (free tier available)

---

## Security Best Practices

- [x] API key stored as encrypted environment variable (not in code)
- [x] `.env.local` and `.env` in `.gitignore`
- [x] No secrets committed to GitHub
- [x] HTTPS enforced automatically by Cloudflare
- [x] Environment variables encrypted at rest in Cloudflare

### Additional Recommendations
- Rotate API keys periodically (every 90 days)
- Monitor API usage in OpenAI dashboard
- Set up billing alerts in OpenAI account
- Review Cloudflare Pages access logs regularly

---

## Rollback Procedure

If a deployment introduces issues:

1. **Via Cloudflare Dashboard**:
   - Go to Pages project → Deployments
   - Find last working deployment
   - Click "..." menu → "Rollback to this deployment"
   - Confirm rollback

2. **Via Git**:
   ```bash
   # Find last working commit
   git log --oneline

   # Revert to specific commit
   git reset --hard <commit-hash>
   git push --force

   # Cloudflare automatically redeploys
   ```

---

## Support Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Next.js on Cloudflare Pages**: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **OpenAI ChatKit Docs**: https://platform.openai.com/docs/guides/chatkit
- **Cloudflare Community**: https://community.cloudflare.com/

---

## Definition of Done

- [x] Code pushed to GitHub repository
- [x] Cloudflare Pages project created and linked
- [x] Environment variables configured (OPENAI_API_KEY, NODE_VERSION)
- [x] Initial deployment successful
- [x] Site accessible at Cloudflare Pages URL (*.pages.dev)
- [x] Chat initializes and works correctly
- [x] All widget buttons functional
- [x] API routes responding correctly
- [x] No console errors in production
- [x] Lighthouse scores meet targets (>85 performance)
- [ ] Custom domain configured (if desired)
- [ ] DNS propagated and SSL active (if custom domain)
- [x] Post-deployment verification complete

---

**Deployment completed**: _____________  
**Production URL**: _____________  
**Custom domain active**: [ ] Yes [ ] No
