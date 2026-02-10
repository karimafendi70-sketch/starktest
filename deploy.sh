#!/bin/bash

# 🚀 Quick Deploy Script for Vercel
# This script helps you deploy the app and get your live link

echo "🚀 Deploying Encrypted Journal App to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready!"
echo ""

# Deploy
echo "🌍 Starting deployment..."
echo "This will take about 2-3 minutes..."
echo ""

vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your app is live!"
echo ""
echo "📋 Next steps:"
echo "  1. Open the link shown above"
echo "  2. Create your first user account"
echo "  3. Start writing in your encrypted journal"
echo "  4. Share your link with others!"
echo ""
echo "📚 Documentation:"
echo "  - LIVE_LINK.md - Full deployment guide"
echo "  - APP_READY.md - Testing guide"
echo "  - TESTING_GUIDE.md - Feature testing"
echo ""
echo "Happy journaling! ✨"
