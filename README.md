# Encrypted Journal

A completely local, encrypted personal journal application. Your thoughts stay on your device, always private and secure.

## Features

- AES-256 encryption for all journal entries
- Completely offline - no cloud sync
- Dark mode support
- Tags and mood tracking
- Statistics and insights
- Auto-lock after inactivity
- Export/import functionality
- Mobile-first responsive design

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- IndexedDB for local storage
- Web Crypto API for encryption
- Framer Motion (Animations)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

**Note**: This app works completely offline and doesn't require any environment variables for core functionality. Supabase integration is optional and currently unused.

If you want to use Supabase features in the future, create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

This app can be deployed to Vercel with zero configuration:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy (no environment variables required)

## License

ISC
