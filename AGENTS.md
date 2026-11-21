<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Lumen Images - Agent Reference

## Project Overview
Next.js 16 (App Router) + TypeScript photo collection app with:
- PostgreSQL database (via `postgres` + `pg` for better-auth)
- AWS S3 for image storage
- better-auth for authentication (email/password)
- Google GenAI (Gemini Flash) for image analysis
- Resend for transactional email (verification, password reset)
- shadcn/ui components with Tailwind CSS v4

## Commands
```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm start      # Run production server
pnpm lint       # Run ESLint
pnpm typecheck  # tsc --noEmit
pnpm test       # Unit tests (tests/*.mjs)
```

## Architecture

### Entry Points
- `app/page.tsx` - Landing page (public)
- `app/layout.tsx` - Root layout with ThemeProvider, Toaster
- `app/home/page.tsx` - Protected home dashboard
- `app/home/photos/page.tsx` - User photos gallery
- `app/home/albums/page.tsx` - User albums list
- `app/home/albums/[id]/page.tsx` - Album detail view
- `app/home/upload/page.tsx` - Upload page
- `app/home/insights/page.tsx` - AI tag insights dashboard
- `app/home/prefs/page.tsx` - Account settings
- `app/login`, `app/signup`, `app/forgot-password`, `app/reset-password`, `app/verify-email` - Auth pages
- `proxy.ts` - Redirects unauthenticated requests under `/home/*` to `/login`

### API Routes
| Route | Purpose |
|-------|---------|
| `app/api/auth/[...all]/route.ts` | better-auth handler |
| `app/api/upload/route.ts` | Upload image to S3 + save metadata to DB |
| `app/api/analyze/route.ts` | Analyze photo with Gemini AI (rate limited: 10/min/user) |

### Server Libraries (`app/lib/`)
- `db.ts` - postgres client (requires `DATABASE_URL`)
- `auth.ts` - better-auth config with pg Pool (shares `DATABASE_URL`)
- `actions.ts` - Server actions for photos/albums (presigned URLs, CRUD, `deletePhoto`)
- `tags.ts` - Server-only tag insertion used by `/api/analyze` (intentionally not a server action)
- `user-actions.ts` / `settings-actions.ts` - Sign-up/sign-in, password change, account deletion
- `email.ts` - Resend email senders
- `lib/env.ts` - Zod-validated environment variables
- `types.ts` - TypeScript types for Photo, Album, AlbumWithPreviews
- `auth-client.ts` - Client-side better-auth client

### Key Patterns
- **Server actions** (`"use server"`) in `actions.ts` for data mutations
- **Presigned S3 URLs** for secure image access (1hr expiry)
- **Session auth** via `auth.api.getSession({ headers: await headers() })` in server actions
- **Every exported function in a `"use server"` file is a public endpoint**: it must check the session and scope queries by `user_id`. Put helpers that take a `userId` argument in non-`"use server"` modules or keep them unexported.
- **Rate limiting** in-memory Map for `/api/analyze` (10 req/min/user/IP)
- **Zod schemas** for API validation and Gemini structured output

### Database Schema (see README for DDL)
- `photos` - photo_id, file_name, user_id, file_size, file_type, last_modified, s3_key, width, height, album_id
- `albums` - album_id, album_name, user_id
- `tags` - id, photo_id, category, label, created_at

### UI Components
Custom shadcn/ui components in `components/ui/` (button, dialog, dropdown-menu, etc.)

## Important Notes
- Uses `@/*` path alias (tsconfig.json)
- Tailwind v4 with PostCSS (`@tailwindcss/postcss`)
- ESLint extends `eslint-config-next` (core-web-vitals + typescript)
- pnpm workspace with specific `onlyBuiltDependencies` for native modules
- Next.js image domains configured for S3 bucket in `next.config.ts`