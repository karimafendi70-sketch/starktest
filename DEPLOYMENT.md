# Deployment Guide - thequiet App

This guide will help you deploy the thequiet sobriety tracking app to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Node.js 18+ installed locally

## Step 1: Set Up Supabase

### Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in project details:
   - **Name**: thequiet
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your users
4. Wait for project creation (~2 minutes)

### Run Database Migration

1. In your Supabase project dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to execute

### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable the **Email** provider
3. (Optional) Customize email templates in **Settings** → **Auth** → **Email Templates**

### Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (the `anon` key)

## Step 2: Deploy to Vercel

### Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Set Environment Variables

In the Vercel project settings, add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Deploy

1. Click **Deploy**
2. Wait for deployment to complete (~2-3 minutes)
3. Visit your production URL

## Step 3: Verify Deployment

### Test the Application

1. Visit your Vercel deployment URL
2. Test the onboarding flow:
   - Welcome screen loads correctly
   - Select a habit (e.g., "Alcohol")
   - Set frequency
   - Choose goals
   - Verify dashboard loads with counter

### Test Authentication (When Implemented)

1. Try creating a new account
2. Check Supabase dashboard → **Authentication** → **Users**
3. Verify user appears in the list

## Step 4: Configure Custom Domain (Optional)

### Add Domain in Vercel

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

### Update Supabase Settings

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your custom domain to **Site URL**
3. Add redirect URLs if needed

## Monitoring & Maintenance

### Vercel Analytics

- Enable Vercel Analytics in project settings
- Monitor page performance and user traffic

### Supabase Monitoring

- Check **Database** → **Database** for performance metrics
- Monitor **Auth** → **Users** for user growth
- Review **Logs** for any errors

### Regular Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Test locally
npm run dev

# Build and verify
npm run build

# Deploy (push to GitHub, Vercel auto-deploys)
git push origin main
```

## Environment Variables Reference

### Production (.env.production or Vercel)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Development (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel
**Solution**: 
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues

**Issue**: Cannot connect to Supabase
**Solution**:
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS policies are enabled

### Authentication Not Working

**Issue**: Users can't sign up/login
**Solution**:
- Verify email provider is enabled in Supabase
- Check redirect URLs in Supabase settings
- Ensure environment variables are correct

### Slow Performance

**Issue**: App loads slowly
**Solution**:
- Enable Vercel Edge caching
- Optimize images with Next.js Image component
- Check database query performance in Supabase

## Security Checklist

- [ ] Environment variables are set in Vercel (not committed to git)
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Email verification is enabled (when auth is implemented)
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Content Security Policy headers are configured
- [ ] Rate limiting is configured (Supabase provides this)

## Backup & Recovery

### Database Backups

Supabase automatically backs up your database daily. To create manual backups:

1. Go to **Database** → **Backups**
2. Click **Create Backup**
3. Download backup if needed

### Restore from Backup

1. Go to **Database** → **Backups**
2. Select backup to restore
3. Click **Restore**

## Scaling Considerations

### Free Tier Limits

- **Vercel Free**: 100GB bandwidth/month, unlimited deployments
- **Supabase Free**: 500MB database, 2GB bandwidth, 50K monthly active users

### Upgrade When Needed

- Monitor usage in both dashboards
- Upgrade Supabase to Pro when approaching limits
- Upgrade Vercel to Pro for teams or high traffic

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Issues**: https://github.com/karimafendi70-sketch/starktest/issues

## Post-Deployment Checklist

- [ ] Application accessible at production URL
- [ ] All pages load correctly
- [ ] Onboarding flow works end-to-end
- [ ] Database tables created successfully
- [ ] RLS policies active
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Monitoring set up
- [ ] Backup strategy confirmed
- [ ] Performance tested
- [ ] Mobile responsiveness verified

---

**Congratulations!** 🎉 Your thequiet app is now live and helping people on their sobriety journey!
