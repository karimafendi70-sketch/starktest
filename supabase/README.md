# Supabase Setup Guide

This directory contains database migrations and configuration for the thequiet app.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `thequiet`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Wait for the project to be created (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (the `anon` key under "Project API keys")

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit `.env.local` to git!

### 4. Run Database Migrations

There are two ways to run migrations:

#### Option A: Using Supabase SQL Editor (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** to execute the migration

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Verify Database Setup

After running migrations, verify in your Supabase dashboard:

1. Go to **Table Editor** - you should see all tables (profiles, habits, etc.)
2. Go to **Authentication** → **Policies** - verify RLS policies are enabled
3. Check the **milestones** table - it should have default milestone data

### 6. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if desired (Settings → Auth → Email Templates)

## Database Schema

The database includes the following tables:

- **profiles**: User profile information (extends Supabase auth.users)
- **habits**: Habits/addictions being tracked
- **sobriety_sessions**: Active tracking sessions for habits
- **check_ins**: Daily check-in records
- **journal_entries**: User journal entries
- **milestones**: Predefined and custom milestones
- **user_milestones**: Achievements earned by users
- **goals**: User's selected life improvement goals
- **settings**: User preferences and notification settings

## Row Level Security (RLS)

All tables have RLS policies enabled to ensure users can only access their own data.

## Indexes

Performance indexes are created on foreign keys and frequently queried columns.

## Next Steps

After setting up Supabase:

1. Test authentication by creating a test user
2. Verify you can create and read data through the app
3. Test the onboarding flow end-to-end
4. Configure email templates for notifications (Phase 2)

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the migration SQL in the correct order
- Check the SQL Editor for any error messages

### Authentication not working
- Verify your environment variables are correct
- Check that email provider is enabled in Supabase
- Look for errors in browser console

### RLS policy errors
- Verify the user is authenticated
- Check that `auth.uid()` matches the `user_id` in your queries

## Support

For more information, visit:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
