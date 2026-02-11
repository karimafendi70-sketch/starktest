# Netlify Deployment Guide - thequiet App

This guide will walk you through deploying the thequiet sobriety tracking app to Netlify.

## Prerequisites

- GitHub account
- Netlify account (free tier works)
- Supabase account (free tier works) - Optional but recommended
- Node.js 18+ installed locally

## Step 1: Prepare Your Repository

### 1.1 Ensure Configuration Files Exist

Make sure these files are in your repository:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `package.json` - Dependencies and build scripts
- ✅ `next.config.js` - Next.js configuration

### 1.2 Test Build Locally

```bash
# Install dependencies
npm install

# Test production build
npm run build

# Test production server
npm start
```

If the build succeeds locally, you're ready to deploy!

## Step 2: Set Up Supabase (Optional)

If you want to use Supabase for backend features:

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in project details:
   - **Name**: thequiet
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your users
4. Wait for project creation (~2 minutes)

### Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (the `anon` key)

Keep these values handy for Step 4.

## Step 3: Deploy to Netlify

### 3.1 Connect Your Repository

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** as your provider
4. Authorize Netlify to access your GitHub account
5. Select your repository: `karimafendi70-sketch/starktest`

### 3.2 Configure Build Settings

Netlify should automatically detect Next.js. Verify these settings:

- **Branch to deploy**: `main` (or your preferred branch)
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Install command**: `npm install`

**Note**: The `netlify.toml` file will override these settings automatically.

### 3.3 Deploy!

1. Click **Deploy site**
2. Wait for deployment to complete (~2-5 minutes)
3. Netlify will provide a random URL like: `https://random-name-12345.netlify.app`

## Step 4: Configure Environment Variables

### 4.1 Add Environment Variables in Netlify

1. Go to your site dashboard
2. Click **Site configuration** → **Environment variables**
3. Click **Add a variable** and add these:

#### Required Variables (if using Supabase):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Optional Variables:

```bash
NODE_VERSION=18.17.0
NPM_VERSION=9.6.7
```

### 4.2 Redeploy After Adding Variables

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the new deployment to complete

## Step 5: Verify Deployment

### 5.1 Test the Application

Visit your Netlify URL and test:

1. ✅ Landing page loads correctly
2. ✅ Navigation works (all pages load)
3. ✅ Write page (`/write`) is accessible
4. ✅ Search and filter functionality works
5. ✅ Images and styles load properly
6. ✅ Mobile view is responsive

### 5.2 Check Netlify Deploy Logs

If something doesn't work:
1. Go to **Deploys** tab
2. Click on the latest deploy
3. Check **Deploy log** for errors
4. Check **Function log** if using serverless functions

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Domain in Netlify

1. Go to **Site configuration** → **Domain management**
2. Click **Add domain** or **Add custom domain**
3. Enter your domain (e.g., `thequiet.app`)
4. Follow Netlify's instructions to update your DNS

### 6.2 DNS Configuration

Add these records to your domain provider:

**For apex domain (thequiet.app):**
```
A Record: 75.2.60.5
```

**For subdomain (www.thequiet.app):**
```
CNAME Record: your-site.netlify.app
```

### 6.3 Enable HTTPS

1. Netlify automatically provisions SSL certificates
2. Wait 24-48 hours for DNS propagation
3. Enable **Force HTTPS** in domain settings

## Step 7: Optimize and Monitor

### 7.1 Enable Netlify Analytics (Optional)

1. Go to your site dashboard
2. Click **Analytics** tab
3. Enable Netlify Analytics (paid feature)

### 7.2 Set Up Deploy Notifications

1. Go to **Site configuration** → **Build & deploy**
2. Scroll to **Deploy notifications**
3. Add notifications for:
   - Deploy succeeded
   - Deploy failed
   - Deploy started

### 7.3 Configure Build Hooks (Optional)

For automated deployments:
1. Go to **Site configuration** → **Build & deploy**
2. Scroll to **Build hooks**
3. Click **Add build hook**
4. Name it (e.g., "Trigger deploy")
5. Copy the webhook URL
6. Use it in CI/CD pipelines or scheduled builds

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Command failed with exit code 1"

**Solutions**:
- Check the deploy log for specific errors
- Verify `package.json` has all dependencies
- Ensure Node.js version is compatible (18+)
- Try building locally first: `npm run build`

**Issue**: "Module not found" errors

**Solutions**:
- Check if the module is in `package.json` dependencies
- Clear build cache: **Site configuration** → **Build & deploy** → **Clear cache**
- Redeploy

### Runtime Errors

**Issue**: Page shows 404 errors

**Solutions**:
- Verify `netlify.toml` has correct redirects configuration
- Check if pages exist in your app
- Ensure `output: 'export'` is NOT set in `next.config.js` (unless using static export)

**Issue**: Environment variables not working

**Solutions**:
- Verify variables are set in Netlify dashboard
- Check variable names match exactly (case-sensitive)
- Prefix public variables with `NEXT_PUBLIC_`
- Redeploy after adding variables

### Performance Issues

**Issue**: Slow page loads

**Solutions**:
- Enable Netlify's CDN (automatic)
- Optimize images using Next.js `<Image>` component
- Enable caching headers (configured in `netlify.toml`)
- Use Netlify's Asset Optimization features

**Issue**: Large bundle size

**Solutions**:
- Analyze bundle: `npm run build` (shows bundle sizes)
- Use dynamic imports for large components
- Remove unused dependencies
- Enable tree shaking

## Netlify-Specific Features

### Edge Functions

For advanced use cases, you can use Netlify Edge Functions:

1. Create `netlify/edge-functions/` directory
2. Add your edge function files
3. Configure in `netlify.toml`:

```toml
[[edge_functions]]
  function = "your-function"
  path = "/api/*"
```

### Forms

Netlify has built-in form handling:

1. Add `netlify` attribute to forms
2. Forms are automatically processed
3. View submissions in Netlify dashboard

### Identity

Use Netlify Identity for authentication:

1. Enable in **Site configuration** → **Identity**
2. Configure providers (Google, GitHub, etc.)
3. Use Netlify Identity Widget in your app

## Continuous Deployment

Netlify automatically deploys when you push to your configured branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Netlify automatically detects the push
4. Builds and deploys your site
5. You'll receive a notification when done

## Environment-Specific Deployments

### Deploy Previews

Netlify automatically creates deploy previews for pull requests:

1. Create a new branch
2. Push changes
3. Create a pull request
4. Netlify builds a preview URL
5. Test changes before merging

### Branch Deploys

Deploy different branches to different URLs:

1. Go to **Site configuration** → **Build & deploy**
2. Scroll to **Branch deploys**
3. Choose branches to deploy
4. Each branch gets its own URL

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use `NEXT_PUBLIC_` prefix only for client-side variables
- ✅ Keep sensitive keys server-side only
- ✅ Rotate keys regularly

### Headers

Security headers are configured in `netlify.toml`:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### HTTPS

- ✅ Always use HTTPS (Netlify provides free SSL)
- ✅ Enable "Force HTTPS" in domain settings
- ✅ Use HSTS headers for additional security

## Cost Optimization

### Netlify Free Tier Includes:

- ✅ 100GB bandwidth per month
- ✅ 300 build minutes per month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Deploy previews
- ✅ Form submissions (100/month)

### Tips to Stay Within Free Tier:

1. Optimize images to reduce bandwidth
2. Use caching effectively
3. Minimize build frequency
4. Use serverless functions sparingly

### When to Upgrade:

Consider upgrading to Pro ($19/month) if you need:
- More bandwidth (>100GB/month)
- More build minutes
- Password protection
- Advanced analytics
- Priority support

## Monitoring and Logs

### Deploy Logs

1. Go to **Deploys** tab
2. Click on any deploy
3. View build logs for debugging

### Function Logs

1. Go to **Functions** tab
2. View real-time function invocations
3. Check for errors and performance

### Analytics (Paid)

1. Enable Netlify Analytics
2. View page views, unique visitors
3. Monitor performance metrics

## Backup and Rollback

### Rollback to Previous Deploy

1. Go to **Deploys** tab
2. Find the previous working deploy
3. Click **...** menu → **Publish deploy**
4. Site instantly rolls back

### Download Site

1. Go to any deploy
2. Click **...** menu → **Download deploy**
3. Get a zip file of your built site

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Community**: https://answers.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/overview/
- **Support**: https://www.netlify.com/support/

## Quick Reference

### Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Essential Netlify CLI Commands

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy manually
netlify deploy

# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open

# View logs
netlify logs
```

## Post-Deployment Checklist

- [ ] Site accessible at Netlify URL
- [ ] All pages load correctly
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled and forced
- [ ] Build notifications set up
- [ ] Forms working (if applicable)
- [ ] Functions working (if applicable)
- [ ] Mobile responsiveness verified
- [ ] Performance tested
- [ ] Security headers active
- [ ] Analytics enabled (optional)

---

**Congratulations!** 🎉 Your thequiet app is now live on Netlify!

For issues or questions, check the [Netlify Community Forums](https://answers.netlify.com) or open an issue on GitHub.
