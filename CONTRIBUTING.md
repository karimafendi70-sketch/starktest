# Contributing to thequiet

Thank you for your interest in contributing to thequiet! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A Supabase account (for database testing)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/karimafendi70-sketch/starktest.git
   cd starktest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   - Navigate to http://localhost:3000

## Project Structure

```
starktest/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard
│   ├── login/              # Login page
│   ├── onboarding/         # Onboarding flow
│   │   ├── habits/         # Habit selection
│   │   ├── frequency/      # Frequency tracking
│   │   └── goals/          # Goals selection
│   ├── restore/            # Data restore page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Welcome page
├── components/             # Reusable components (future)
├── lib/                    # Utility functions
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Helper functions
├── supabase/               # Database files
│   ├── migrations/         # SQL migrations
│   └── README.md           # Setup guide
├── types/                  # TypeScript types
│   └── database.types.ts   # Database types
└── public/                 # Static assets (future)
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

### React Components

- Use functional components with hooks
- Use "use client" directive for client components
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure mobile-first responsive design
- Maintain dark mode support

### File Naming

- Use kebab-case for files: `my-component.tsx`
- Use PascalCase for components: `MyComponent`
- Use camelCase for functions: `myFunction`

## Making Changes

### Before You Start

1. Check existing issues to avoid duplication
2. Create or comment on an issue to discuss major changes
3. Fork the repository
4. Create a feature branch from `main`

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing patterns
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   npm run build
   npm run dev
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changed and why
   - Add screenshots for UI changes

## Commit Message Convention

Follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add milestone celebration animation
fix: resolve counter not updating on dashboard
docs: update setup instructions
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors
- [ ] Changes tested locally
- [ ] No console errors or warnings
- [ ] Mobile responsive (if UI change)
- [ ] Dark mode works correctly
- [ ] Dutch text is accurate (if applicable)

### PR Description Should Include

- Summary of changes
- Motivation and context
- Screenshots (for UI changes)
- Testing steps
- Related issue numbers

### Review Process

1. Maintainers review your PR
2. Address any feedback
3. Once approved, PR will be merged
4. Your contribution will be deployed!

## Feature Requests

### Phase 1 (Current - MVP)
- ✅ Onboarding flow
- ✅ Dashboard with sobriety counter
- ✅ Dark mode
- ✅ Database schema

### Phase 2 (Planned)
- [ ] Supabase authentication
- [ ] Progress tracking with charts
- [ ] Journal functionality
- [ ] Email notifications
- [ ] PWA support
- [ ] Light mode
- [ ] English language

### How to Suggest Features

1. Check if feature already requested
2. Create new issue with "Feature Request" label
3. Describe the feature clearly
4. Explain the use case
5. Include mockups if possible

## Bug Reports

### Before Reporting

1. Check if bug already reported
2. Verify it's not a configuration issue
3. Test in latest version

### Bug Report Should Include

- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/device information
- Console errors (if any)

## Database Changes

### Adding Tables or Columns

1. Create a new migration file in `supabase/migrations/`
2. Name it: `00X_description.sql`
3. Include:
   - Table/column creation
   - RLS policies
   - Indexes if needed
4. Update TypeScript types in `types/database.types.ts`
5. Document the change

### Example Migration

```sql
-- Add new column
ALTER TABLE public.profiles
  ADD COLUMN nickname TEXT;

-- Create RLS policy
CREATE POLICY "Users can update nickname"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

## UI/UX Guidelines

### Design Principles

- **Calm & Supportive**: Use soft colors and gentle animations
- **Clear & Simple**: Avoid clutter, prioritize content
- **Encouraging**: Celebrate progress, acknowledge effort
- **Accessible**: High contrast, readable fonts, touch-friendly

### Color Palette

- Primary: Purple gradient (#667eea to #764ba2)
- Background: Dark (#0a0a1a)
- Text: Light (#ffffff, #e0e0e0)
- Accent: Various for stats (green, blue, etc.)

### Typography

- Headings: Bold, clear hierarchy
- Body: Readable size (16px+)
- Small text: Use sparingly (14px minimum)

## Testing

### Manual Testing Checklist

- [ ] Welcome page loads
- [ ] Onboarding flow completes
- [ ] Dashboard shows counter
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Dark mode renders correctly
- [ ] No console errors

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)

## Questions?

- Open an issue for questions
- Tag as "question"
- Check existing discussions first

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the issue, not the person
- Help create a positive environment

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to thequiet! Together we're building something that can help people improve their lives. 💜
