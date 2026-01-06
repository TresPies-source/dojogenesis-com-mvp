# Custom Domain Setup: DojoGenesis.com

**Time Required**: 5-15 minutes (depending on DNS propagation)

---

## Prerequisites

- [x] Cloudflare Pages project deployed successfully
- [x] Site working at `*.pages.dev` URL
- [ ] Domain `dojogenesis.com` purchased and accessible
- [ ] Access to domain DNS settings (Cloudflare or external provider)

---

## Step 1: Add Custom Domain in Cloudflare Pages

1. **Navigate to Custom Domains**
   - Log in to https://dash.cloudflare.com
   - Go to **Workers & Pages**
   - Select your project: `dojogenesis`
   - Click **Custom domains** tab
   - Click **Set up a custom domain** button

2. **Enter Domain**
   - Domain: `dojogenesis.com`
   - Click **Continue**

3. **Choose DNS Configuration Method**

   Cloudflare will detect if your domain is using Cloudflare DNS or external DNS.

---

## Step 2: Configure DNS

### Option A: Domain Already on Cloudflare DNS (Recommended - Fastest)

**If your domain is already managed by Cloudflare:**

1. Cloudflare will show: "This domain is on Cloudflare"
2. Click **Activate Domain**
3. Cloudflare automatically creates:
   - CNAME record: `dojogenesis.com` → `dojogenesis.pages.dev`
   - CNAME record: `www.dojogenesis.com` → `dojogenesis.pages.dev` (optional)
4. SSL certificate provisions **immediately** (Universal SSL)
5. Domain active in **< 2 minutes**

**Verification:**
- DNS records appear in Cloudflare DNS dashboard
- SSL status shows "Active Certificate"
- Domain listed as "Active" in Custom Domains tab

---

### Option B: Domain on External DNS Provider (GoDaddy, Namecheap, etc.)

**If your domain is NOT managed by Cloudflare:**

1. Cloudflare will provide CNAME target (e.g., `dojogenesis.pages.dev`)

2. **Log in to your DNS provider** (GoDaddy, Namecheap, etc.)

3. **Add CNAME Record for Root Domain**
   ```
   Type:     CNAME
   Name:     @ (or dojogenesis.com or root)
   Value:    dojogenesis.pages.dev (your Cloudflare Pages URL)
   TTL:      Auto or 300 (5 minutes)
   ```

4. **Add CNAME Record for WWW (Optional)**
   ```
   Type:     CNAME
   Name:     www
   Value:    dojogenesis.pages.dev
   TTL:      Auto or 300
   ```

5. **Save DNS Changes**

6. **Wait for DNS Propagation**
   - Typical time: 5-15 minutes
   - Maximum time: 24-48 hours (rare)
   - Check propagation: https://dnschecker.org/#CNAME/dojogenesis.com

7. **Return to Cloudflare Pages Dashboard**
   - DNS validation runs automatically
   - SSL certificate provisions after DNS validation
   - Status changes to "Active" when complete

---

### Option C: Migrate Domain to Cloudflare DNS (Best Long-Term)

**Benefits:**
- Instant DNS updates
- Automatic SSL provisioning
- Free DDoS protection
- Faster DNS resolution
- Unified dashboard

**Steps:**
1. In Cloudflare dashboard, click **Add a Site**
2. Enter `dojogenesis.com`
3. Select **Free** plan
4. Cloudflare scans existing DNS records
5. Review and confirm DNS records
6. Cloudflare provides nameservers (e.g., `ns1.cloudflare.com`)
7. Update nameservers at your domain registrar:
   - Log in to domain registrar (GoDaddy, Namecheap, etc.)
   - Find "Nameservers" or "DNS Settings"
   - Replace existing nameservers with Cloudflare nameservers
   - Save changes
8. Return to Cloudflare and wait for verification (5 mins - 24 hours)
9. Once verified, follow **Option A** above

---

## Step 3: Verify SSL Certificate

1. **Check SSL Status in Cloudflare**
   - Go to Custom Domains tab
   - Status should show "Active"
   - SSL certificate icon should be green

2. **Test HTTPS**
   - Visit https://dojogenesis.com
   - Look for padlock icon in browser address bar
   - Click padlock → Certificate details
   - Verify certificate issued by Cloudflare

**If SSL Not Active:**
- Wait 5-10 minutes (SSL provisioning in progress)
- Check DNS propagation (must complete before SSL)
- Verify CNAME record is correct

---

## Step 4: Test Custom Domain

### Functional Tests

- [ ] Visit https://dojogenesis.com (loads successfully)
- [ ] HTTPS works (padlock icon visible)
- [ ] Hero section displays correctly
- [ ] Chat interface initializes
- [ ] Click widget button: "Show me an example"
- [ ] Send test message
- [ ] Verify response from ChatKit workflow

### Redirect Tests (Optional)

- [ ] http://dojogenesis.com → redirects to https://dojogenesis.com
- [ ] www.dojogenesis.com → redirects to dojogenesis.com (if configured)

### Performance Test

- [ ] Page loads in < 3 seconds
- [ ] No console errors (F12 → Console tab)
- [ ] No 404 errors for assets (F12 → Network tab)

---

## Step 5: Configure WWW Redirect (Optional)

**To redirect www.dojogenesis.com → dojogenesis.com:**

1. In Cloudflare Pages Custom Domains:
   - Add `www.dojogenesis.com` as a second custom domain
2. Cloudflare automatically handles redirect
3. Verify: https://www.dojogenesis.com redirects to https://dojogenesis.com

---

## Troubleshooting

### "DNS Record Not Found" Error

**Cause**: DNS records not propagated yet

**Solution:**
- Wait 5-15 minutes
- Check propagation: https://dnschecker.org/#CNAME/dojogenesis.com
- Verify CNAME value is correct (should point to `*.pages.dev`)
- Clear browser DNS cache:
  - Chrome: chrome://net-internals/#dns → Clear host cache
  - Firefox: about:networking#dns → Clear DNS Cache

---

### "SSL Certificate Provisioning" Stuck

**Cause**: DNS not fully propagated or CAA records blocking SSL

**Solution:**
- Ensure DNS propagation complete (all regions show correct CNAME)
- Check for CAA records at your DNS provider (should allow Cloudflare):
  ```
  dojogenesis.com. CAA 0 issue "letsencrypt.org"
  dojogenesis.com. CAA 0 issue "pki.goog"
  ```
  If no CAA records exist, SSL should provision automatically
- Wait up to 24 hours for full SSL activation
- Contact Cloudflare support if stuck > 24 hours

---

### Domain Shows Cloudflare Pages Default Page

**Cause**: Custom domain not activated in Cloudflare Pages

**Solution:**
- Verify domain listed as "Active" in Custom Domains tab
- Try visiting `dojogenesis.pages.dev` directly (should work)
- Redeploy project: Pages → Deployments → Retry deployment
- Wait 5 minutes and retry

---

### Mixed Content Warnings (HTTP/HTTPS)

**Cause**: Resources loaded over HTTP instead of HTTPS

**Solution:**
- Check browser console for mixed content warnings
- All assets should load from `https://`
- Verify ChatKit script loads from `https://chatkit.openai.com`
- Check API routes use relative URLs (not absolute HTTP)

---

## DNS Configuration Examples

### GoDaddy DNS
```
Type: CNAME
Name: @
Value: dojogenesis.pages.dev
TTL: 600 seconds
```

### Namecheap DNS
```
Type: CNAME Record
Host: @
Value: dojogenesis.pages.dev
TTL: Automatic
```

### Google Domains DNS
```
Resource Type: CNAME
Name: @
Data: dojogenesis.pages.dev
TTL: 3600
```

### Cloudflare DNS (Managed Domain)
```
Type: CNAME
Name: dojogenesis.com (or @)
Target: dojogenesis.pages.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

---

## Post-Configuration Checklist

- [ ] https://dojogenesis.com loads successfully
- [ ] SSL certificate active (padlock icon)
- [ ] Chat initializes correctly
- [ ] Widget buttons work
- [ ] No console errors
- [ ] Mobile responsive (test on phone)
- [ ] HTTP → HTTPS redirect working
- [ ] www redirect configured (if desired)
- [ ] DNS propagation complete (check https://dnschecker.org)
- [ ] Run Lighthouse audit (Performance > 85)

---

## Monitoring Domain Health

### DNS Monitoring Tools
- **DNS Checker**: https://dnschecker.org
- **What's My DNS**: https://whatsmydns.net
- **DNS Propagation**: https://dnspropagation.net

### SSL Monitoring Tools
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html

### Uptime Monitoring (Free)
- **UptimeRobot**: https://uptimerobot.com (50 monitors free)
- **Pingdom**: https://www.pingdom.com (free tier available)

---

## Definition of Done

- [x] Custom domain added in Cloudflare Pages
- [x] DNS records configured (CNAME pointing to `*.pages.dev`)
- [x] DNS propagation complete (verified on https://dnschecker.org)
- [x] SSL certificate active and valid
- [x] Site accessible at https://dojogenesis.com
- [x] HTTPS redirect working (http → https)
- [x] All functionality tested on custom domain
- [x] No certificate warnings in browser
- [x] No console errors on production domain
- [x] Lighthouse performance > 85 on custom domain

---

**Custom Domain Activated**: _______________  
**SSL Certificate Issued**: _______________  
**Production URL**: https://dojogenesis.com
