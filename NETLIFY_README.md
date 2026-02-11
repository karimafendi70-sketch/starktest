# Quick Start: Deploy to Netlify

## 🚀 One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/karimafendi70-sketch/starktest)

## 📋 Manual Deployment Steps

### 1. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select this repository
4. Netlify auto-detects Next.js settings

### 2. Environment Variables (Optional)

If using Supabase, add these in Netlify dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Deploy

Click "Deploy site" - Done! 🎉

## 📖 Full Documentation

For detailed instructions, see [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

## ⚙️ Configuration Files

- `netlify.toml` - Netlify build configuration
- `next.config.js` - Next.js configuration
- `package.json` - Dependencies and scripts

## 🔧 Local Testing

```bash
# Install dependencies
npm install

# Build
npm run build

# Run production server
npm start
```

## 🆘 Need Help?

- [Netlify Documentation](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [GitHub Issues](https://github.com/karimafendi70-sketch/starktest/issues)
