<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lumen Images - Agent Reference

## Project Overview
Next.js 16 (App Router) + TypeScript photo collection app with:
- PostgreSQL database (via `postgres` + `pg` for better-auth)
- AWS S3 for image storage
- better-auth for authentication (email/password)
- Google GenAI (Gemini 2.5 Flash) for image analysis
- shadcn/ui components with Tailwind CSS v4

## Commands
```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm start      # Run production server
pnpm lint       # Run ESLint
```

## Architecture

### Entry Points
- `app/page.tsx` - Landing page (public)
- `app/layout.tsx` - Root layout with ThemeProvider, Toaster
- `app/home/page.tsx` - Protected home dashboard
- `app/home/photos/page.tsx` - User photos gallery
- `app/home/albums/page.tsx` - User albums list
- `app/home/albums/[id]/page.tsx` - Album detail view

### API Routes
| Route | Purpose |
|-------|---------|
| `app/api/auth/[...all]/route.ts` | better-auth handler |
| `app/api/upload/route.ts` | Upload image to S3 + save metadata to DB |
| `app/api/analyze/route.ts` | Analyze photo with Gemini AI (rate limited: 10/min/user) |
| `app/api/delete/route.ts` | Delete photo from S3 + DB |

### Server Libraries (`app/lib/`)
- `db.ts` - postgres client (requires `DATABASE_URL`)
- `auth.ts` - better-auth config with pg Pool (requires DATABASE_* vars)
- `actions.ts` - Server actions for photos/albums (presigned URLs, CRUD)
- `types.ts` - TypeScript types for Photo, Album, AlbumWithPreviews
- `auth-client.ts` - Client-side better-auth client

### Key Patterns
- **Server actions** (`"use server"`) in `actions.ts` for data mutations
- **Presigned S3 URLs** for secure image access (1hr expiry)
- **Session auth** via `auth.api.getSession({ headers: await headers() })` in server actions
- **Rate limiting** in-memory Map for `/api/analyze` (10 req/min/user/IP)
- **Zod schemas** for API validation and Gemini structured output

### Database Schema (inferred)
- `photos` - file_name, user_id, file_size, file_type, last_modified, s3_key, width, height, album_id
- `albums` - album_name, user_id

### UI Components
Custom shadcn/ui components in `components/ui/` (button, dialog, dropdown-menu, etc.)

## Important Notes
- Uses `@/*` path alias (tsconfig.json)
- Tailwind v4 with PostCSS (`@tailwindcss/postcss`)
- ESLint extends `eslint-config-next` (core-web-vitals + typescript)
- pnpm workspace with specific `onlyBuiltDependencies` for native modules
- Next.js image domains configured for S3 bucket in `next.config.ts`