# Encrypted Journal - Your Private Digital Diary

A beautiful, privacy-focused encrypted journal application with multi-user support. Write freely knowing your thoughts are protected with military-grade AES-256 encryption. Completely offline - no cloud, no tracking, no data ever leaves your device.

## 🌐 Try It Live

Want to see the app in action? Deploy your own instance in seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/karimafendi70-sketch/starktest)

Or see the [Quick Deploy Guide](./QUICK_DEPLOY.md) for step-by-step instructions.

> **Note**: This app stores all data locally in your browser. Each deployment/domain has its own isolated storage.

## 🔐 Privacy & Security First

- **AES-256-GCM Encryption**: Military-grade encryption for all journal entries
- **PBKDF2 Password Hashing**: 100,000 iterations with per-user salts
- **Offline-First**: All data stored locally, never sent to any server
- **Multi-User Support**: Up to 5 separate encrypted journals on one device
- **No Tracking**: Zero analytics, no cookies, complete privacy
- **Open Source**: Transparent security you can verify

## ✨ Key Features

### 📔 Multi-User Encrypted Journaling
- Support for up to 5 different users on the same device
- Each user has separate encryption and password
- User avatars and profile management
- Quick user switching without data mixing

### 🎨 Beautiful User Experience
- **Book Reading Mode**: Vintage book aesthetic with page-flip animations
- **Dark Mode**: Easy on the eyes for night journaling
- **Mood Tracking**: Track your emotional journey with mood indicators
- **Tag System**: Organize entries with custom tags
- **Statistics Dashboard**: Visualize your writing patterns and progress

### 📊 Advanced Features
- **Statistics Page**: Track total entries, words written, reading time, mood distribution
- **Achievement System**: Unlock milestones as you write
- **Search & Filter**: Find entries by date, mood, or tags
- **Export & Backup**: Download your encrypted journal data
- **Auto-Save**: Never lose your thoughts

### 🔍 Encryption Proof
- Live encryption/decryption demonstration
- See exactly how your data is protected
- Educational encryption explainer

### 🏠 Navigation & Organization
- Persistent header with home button
- Breadcrumb navigation
- Quick action dashboard
- Recent entries preview

## 🚀 Getting Started

### ⚡ Quick Start (Ready to Test!)

The app is **fully built and ready to use**! Just run:

```bash
# Clone the repository
git clone https://github.com/karimafendi70-sketch/starktest.git
cd starktest

# Install dependencies
npm install

# Start the app
npm run dev
```

Then open **http://localhost:3000** in your browser! 🎉

> **✅ Status**: All features implemented, tested, and ready to use!  
> **📸 Screenshots**: See [APP_READY.md](./APP_READY.md) for visual guide  
> **🧪 Testing**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing checklist

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Storage**: IndexedDB (encrypted data) + localStorage (settings)
- **Encryption**: Web Crypto API (AES-256-GCM)
- **Password Hashing**: PBKDF2 (100,000 iterations)
- **Icons**: Lucide React

## 📱 Features Comparison

| Feature | Free Version | Notes |
|---------|-------------|-------|
| Encrypted Journal | ✅ | Unlimited entries |
| Multi-User (5 users) | ✅ | Separate encryption per user |
| Book Reading Mode | ✅ | Vintage aesthetic |
| Dark Mode | ✅ | System preference sync |
| Mood Tracking | ✅ | 5 mood types |
| Tags & Search | ✅ | Organize and find entries |
| Statistics Dashboard | ✅ | Detailed insights |
| Export & Backup | ✅ | JSON format |
| Photo Journal | 🔜 | Coming soon |
| Voice-to-Text | 🔜 | Coming soon |
| Calendar Heatmap | 🔜 | Coming soon |

## 🔒 Security & Privacy

### How It Works

1. **Password → Encryption Key**
   - Your password is hashed using PBKDF2 (100,000 iterations)
   - The hash is used to derive an AES-256 encryption key
   - Per-user salts ensure unique keys

2. **Data Encryption**
   - All journal entries encrypted with AES-256-GCM
   - Each entry has a unique initialization vector (IV)
   - Metadata (dates, moods) stored unencrypted for filtering

3. **Local Storage Only**
   - IndexedDB for encrypted journal entries
   - localStorage for user settings and preferences
   - No network requests, no cloud sync

4. **Zero Knowledge**
   - Even the app developer cannot read your encrypted data
   - Password never stored - only the hash
   - Encryption happens entirely in your browser

### Security Best Practices

✅ **Strong Passwords**: Use 12+ characters with mixed case, numbers, symbols
✅ **Unique Passwords**: Different password for each user
✅ **Backup Regularly**: Export your encrypted data periodically
✅ **Device Security**: Encrypt your device's hard drive
⚠️ **Lost Password = Lost Data**: Cannot be recovered

## 📖 Usage Guide

### Creating Your First User

1. Click "Access Your Encrypted Diary" on the landing page
2. Click "Create New User"
3. Enter a username (3-20 characters)
4. Create a strong password (8+ characters)
5. Choose or randomize your avatar
6. Click "Create Account"

### Writing Your First Entry

1. After login, you'll see your journal
2. Click "+ New Entry" button
3. Add a title (optional)
4. Write your thoughts
5. Select a mood (optional)
6. Add tags (optional)
7. Entry auto-saves as you type

### Switching Users

1. Click your avatar in the header
2. Select "Switch User"
3. Choose different user from the list
4. Enter their password

### Viewing Statistics

1. Click "Statistics" in the navigation
2. View total entries, words, reading time
3. See mood distribution charts
4. Check achievement progress

## 🎨 Customization

- **Themes**: Light and Dark mode
- **Book Mode**: Toggle vintage reading experience
- **Avatars**: Emoji or color-based profiles
- **Settings**: Auto-lock, font sizes (coming soon)

## 🐛 Known Issues

- Photo journal feature not yet implemented
- Voice-to-text not yet implemented
- Calendar heatmap not yet implemented
- Some mobile gestures may not work in book mode

## 🚧 Roadmap

### Phase 5: Enhanced Book Reading Mode
- [ ] Improved page-flip animations
- [ ] Day/Night reading modes
- [ ] Custom fonts and textures
- [ ] Keyboard shortcuts

### Phase 6: Camera & Photo System
- [ ] Camera capture integration
- [ ] Photo upload
- [ ] Encrypted photo storage
- [ ] Photo gallery view

### Phase 7: Advanced Journal Features
- [ ] Voice-to-text input
- [ ] Calendar heatmap
- [ ] Advanced search filters
- [ ] Writing streak counter

### Phase 8: Themes & Customization
- [ ] Multiple theme presets
- [ ] Background textures
- [ ] Font customization
- [ ] Layout options

### Phase 9: Advanced Security
- [ ] Biometric authentication (where supported)
- [ ] Guest read-only mode
- [ ] Security audit logs

### Phase 10: Premium Features
- [ ] 3-day trial system
- [ ] Pricing page
- [ ] Stripe integration (placeholder)
- [ ] Subscription management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Meaningful component names
- Comprehensive comments for complex logic

## 📄 License

ISC License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Encrypted with [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/karimafendi70-sketch/starktest/issues)
- **Security**: Report security issues privately via GitHub Security Advisories

## ⚖️ Privacy Policy

This application:
- ✅ Stores all data locally on your device
- ✅ Never sends data to any server
- ✅ Contains no analytics or tracking
- ✅ Requires no account creation
- ✅ Collects zero personal information
- ✅ Is completely offline-capable

Your privacy is guaranteed by design.

---

Made with ❤️ for privacy-conscious journalers
