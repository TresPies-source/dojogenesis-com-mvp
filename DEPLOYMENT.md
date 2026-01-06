# DojoGenesis.com MVP - Deployment Guide

This guide covers deploying the DojoGenesis.com MVP to Cloudflare Pages with the custom domain.

## Prerequisites

- ✅ GitHub account
- ✅ Cloudflare account ([Sign up free](https://dash.cloudflare.com/sign-up))
- ✅ OpenAI API key with ChatKit beta access
- ✅ Domain `dojogenesis.com` (managed by Cloudflare DNS or external registrar)

## Deployment Steps

### Step 1: Prepare GitHub Repository

1. **Initialize Git (if not already done)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DojoGenesis.com MVP"
   ```

2. **Create GitHub Repository**:
   - Visit https://github.com/new
   - Name: `dojogenesis-com-mvp` (or your preferred name)
   - Visibility: Public or Private
   - **Do NOT initialize** with README, .gitignore, or license (already exists)

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dojogenesis-com-mvp.git
   git push -u origin main
   ```

### Step 2: Create Cloudflare Pages Project

1. **Login to Cloudflare**:
   - Visit https://dash.cloudflare.com
   - Login or create account

2. **Create Pages Project**:
   - Navigate to **Workers & Pages** (left sidebar)
   - Click **Create** → **Pages** → **Connect to Git**
   - Click **Connect GitHub** (authorize if first time)
   - Select your repository: `dojogenesis-com-mvp`
   - Click **Begin setup**

3. **Configure Build Settings**:
   ```
   Project name: dojogenesis-com-mvp
   Production branch: main
   Framework preset: Next.js (should auto-detect)
   Build command: npm run build
   Build output directory: .next
   Root directory: / (leave blank)
   Node version: 20
   ```

4. **Environment Variables**:
   - Click **Add variable**
   - Add the following:
     ```
     Variable name: OPENAI_API_KEY
     Value: [Your OpenAI API key - starts with sk-...]
     Environment: Production
     ```
   - Click **Encrypt** (lock icon) to mark as secret
   - (Optional) Add `NODE_VERSION=20` if needed

5. **Deploy**:
   - Click **Save and Deploy**
   - Wait 2-5 minutes for initial build
   - Deployment URL will be: `https://dojogenesis-com-mvp.pages.dev`

### Step 3: Verify Deployment

1. **Visit deployment URL**:
   ```
   https://YOUR-PROJECT-NAME.pages.dev
   ```

2. **Test functionality**:
   - [ ] Page loads without errors
   - [ ] Hero section displays correct copy
   - [ ] Chat interface initializes (may take 3-5 seconds)
   - [ ] Widget buttons are visible in chat
   - [ ] Click a widget button (e.g., "Show me an example")
   - [ ] Message appears in chat input and sends

3. **Check Cloudflare Pages logs**:
   - Go to **Workers & Pages** → Your project → **Deployments**
   - Click on latest deployment → **View logs**
   - Verify no build errors or runtime errors

### Step 4: Connect Custom Domain

#### Option A: Domain Managed by Cloudflare DNS

1. **Add Custom Domain**:
   - In your Pages project, go to **Custom Domains** tab
   - Click **Set up a custom domain**
   - Enter: `dojogenesis.com`
   - Click **Continue**

2. **Activate Domain**:
   - Cloudflare will automatically configure DNS records
   - Click **Activate domain**
   - SSL certificate provisioned immediately (Cloudflare Universal SSL)

3. **Verify**:
   - Visit https://dojogenesis.com
   - Should redirect to your Pages deployment
   - SSL certificate should be valid (green padlock in browser)

#### Option B: Domain with External DNS Provider

1. **Add Custom Domain in Cloudflare Pages**:
   - In your Pages project, go to **Custom Domains** tab
   - Click **Set up a custom domain**
   - Enter: `dojogenesis.com`
   - Click **Continue**

2. **Configure DNS at Your Registrar**:
   - Login to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add a **CNAME record**:
     ```
     Type: CNAME
     Name: @ (or dojogenesis.com)
     Value: YOUR-PROJECT-NAME.pages.dev
     TTL: 3600 (or Auto)
     ```
   - **Note**: Some registrars don't allow CNAME on root domain. If so, use:
     - **A record**: `76.76.21.21` (Cloudflare anycast IP)
     - **AAAA record**: `2606:4700:4700::1111` (Cloudflare anycast IPv6)

3. **Wait for DNS Propagation**:
   - Can take 5 minutes to 48 hours
   - Check status: https://www.whatsmydns.net/#CNAME/dojogenesis.com

4. **SSL Certificate**:
   - Cloudflare will automatically provision SSL
   - Usually instant, but can take up to 24 hours

### Step 5: Post-Deployment Verification

Run through this checklist:

- [ ] **Site loads at https://dojogenesis.com**
- [ ] **SSL certificate is valid** (green padlock, no warnings)
- [ ] **Chat initializes within 3 seconds**
- [ ] **All 6 widget buttons work**:
  - [ ] "Start with a real situation"
  - [ ] "Add 3 perspectives"
  - [ ] "Show me an example"
  - [ ] "I'm stuck—help me frame it"
  - [ ] "Generate a next move"
  - [ ] "Pick an output"
- [ ] **API routes functional**:
  - Test: Visit `https://dojogenesis.com/api/chatkit/session` (should return 400 error - expected, proves route works)
- [ ] **Mobile responsive**:
  - Test on mobile device or use Chrome DevTools device emulation
  - [ ] iPhone (375px width)
  - [ ] iPad (768px width)
  - [ ] Desktop (1024px+ width)
- [ ] **No console errors**:
  - Open browser DevTools → Console
  - Refresh page
  - Verify no red errors (warnings are OK)
- [ ] **Lighthouse audit**:
  - Open Chrome DevTools → Lighthouse
  - Run audit on Production URL
  - Verify scores:
    - [ ] Performance > 85
    - [ ] Accessibility > 90
    - [ ] Best Practices > 90
    - [ ] SEO > 90

### Step 6: Continuous Deployment

Cloudflare Pages automatically deploys when you push to `main`:

```bash
# Make changes to code
git add .
git commit -m "Update feature X"
git push origin main

# Cloudflare automatically rebuilds and deploys
# View progress: Workers & Pages → Your project → Deployments
```

**Preview deployments**:
- Pull requests automatically get preview URLs
- Format: `https://[COMMIT_HASH].dojogenesis-com-mvp.pages.dev`

## Alternative: Wrangler CLI Deployment

For direct deployment without GitHub integration:

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build locally**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   wrangler pages deploy .next --project-name=dojogenesis-com-mvp
   ```

5. **Set environment variables**:
   ```bash
   wrangler pages secret put OPENAI_API_KEY --project=dojogenesis-com-mvp
   # Paste your API key when prompted
   ```

## Troubleshooting

### Build Fails on Cloudflare Pages

**Symptoms**: Build fails with `npm install` errors or TypeScript errors

**Solutions**:
1. Check Cloudflare build logs: **Deployments → Latest → View logs**
2. Verify `Node version` is set to 20 in build settings
3. Test build locally: `npm run build` (should succeed)
4. Check `package.json` for any incompatible dependencies
5. Retry deployment: **Deployments → Retry deployment**

### API Routes Return 404

**Symptoms**: Chat fails to initialize, `/api/chatkit/session` returns 404

**Solutions**:
1. Verify Next.js output mode in `next.config.js`: `output: 'standalone'`
2. Check Cloudflare Pages **Functions** tab shows API routes
3. Review deployment logs for API route compilation errors
4. Ensure `app/api/` directory structure is correct

### Environment Variables Not Working

**Symptoms**: Chat session fails with "Invalid API key" or similar

**Solutions**:
1. Go to **Workers & Pages → Your project → Settings → Environment variables**
2. Verify `OPENAI_API_KEY` is set for **Production** environment
3. Ensure variable is marked as **Encrypted** (secret)
4. After adding/changing variables, trigger new deployment: **Deployments → Retry deployment**

### Custom Domain Not Working

**Symptoms**: `dojogenesis.com` doesn't load, SSL errors, or redirects to pages.dev

**Solutions**:
1. **Check DNS propagation**: https://www.whatsmydns.net/#CNAME/dojogenesis.com
2. **Verify DNS records**:
   - CNAME: `dojogenesis.com` → `your-project.pages.dev`
   - Or A record: `76.76.21.21`
3. **Check Cloudflare Pages → Custom Domains tab**:
   - Status should be "Active"
   - If "Pending", wait for DNS propagation (up to 48 hours)
4. **SSL issues**: Disable/re-enable domain in Cloudflare Pages to force SSL renewal

### Widget Buttons Not Working

**Symptoms**: Clicking widget buttons does nothing

**Solutions**:
1. Open browser console (F12) and check for JavaScript errors
2. Verify ChatKit script loaded: Check Network tab for `chatkit.js`
3. Check `/api/widget-action` receives POST requests (Network tab)
4. Ensure `widgets.onAction` handler is registered (check console for "[ChatKit]" logs)
5. Try different widget button to isolate issue

## Monitoring and Maintenance

### View Analytics

1. **Cloudflare Web Analytics** (free):
   - Go to **Analytics & Logs** in Cloudflare dashboard
   - Add web analytics to your domain
   - View page views, unique visitors, top pages

2. **Cloudflare Pages Logs**:
   - **Workers & Pages → Your project → Deployments → View logs**
   - Shows build logs and runtime errors

### Update OpenAI API Key

If you need to rotate your API key:

1. Generate new key at https://platform.openai.com/api-keys
2. Go to **Workers & Pages → Your project → Settings → Environment variables**
3. Click **Edit** on `OPENAI_API_KEY`
4. Update value with new key
5. Click **Save**
6. Trigger new deployment: **Deployments → Retry deployment**

### Rollback Deployment

If a deployment breaks production:

1. Go to **Workers & Pages → Your project → Deployments**
2. Find previous working deployment
3. Click **...** (three dots) → **Rollback to this deployment**
4. Confirm rollback

## Production Checklist

Before announcing the MVP to users:

- [ ] Custom domain `dojogenesis.com` working with HTTPS
- [ ] All 6 widget buttons functional
- [ ] Tested on mobile and desktop
- [ ] Lighthouse performance score > 85
- [ ] No console errors on production site
- [ ] Privacy statement visible in footer
- [ ] OpenAI API key has sufficient credits/quota
- [ ] Cloudflare Pages project has appropriate access controls
- [ ] Domain DNS TTL reduced (for easier updates if needed)
- [ ] GitHub repository README.md updated with live URL

## Next Steps (Post-MVP)

After successful deployment, consider:

1. **Analytics**: Add Cloudflare Web Analytics or Google Analytics
2. **Monitoring**: Set up Sentry or similar for error tracking
3. **Rate Limiting**: Implement rate limiting on API routes (Cloudflare Workers)
4. **CDN Optimization**: Review Cloudflare caching rules
5. **Performance**: Run Lighthouse on production, optimize further
6. **SEO**: Submit sitemap to Google Search Console
7. **User Feedback**: Add feedback mechanism or analytics events

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-06  
**Deployment Platform**: Cloudflare Pages  
**Contact**: Refer to project README.md for support
