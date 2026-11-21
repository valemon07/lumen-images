# Lumen Images

A personal photo collection application built with Next.js 16, featuring secure cloud storage, album organization, and AI-powered image analysis.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Authentication | better-auth (email/password) |
| Database | PostgreSQL (postgres + pg) |
| Storage | AWS S3 (presigned URLs) |
| AI Analysis | Google GenAI (Gemini Flash) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Email | Resend (verification, password reset) |
| Tooling | ESLint, pnpm |

## Features

- **Secure Authentication** — Email/password with email verification, password reset, and session management
- **Photo Upload** — Server-validated uploads (JPEG/PNG/WebP, 20 MiB max) to S3 with metadata persistence
- **Album Organization** — Create and manage photo albums
- **AI Image Analysis** — Gemini-powered tagging (subjects, setting, mood, composition…) with an insights dashboard
- **Presigned URLs** — Secure, time-limited image access
- **Responsive UI** — Mobile-first design with dark mode support

## Getting Started

### Prerequisites
- Node.js 20+ and pnpm
- A PostgreSQL database
- A private AWS S3 bucket and an IAM user with `s3:PutObject`, `s3:GetObject` and `s3:DeleteObject` on it
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A [Resend](https://resend.com/) API key and a verified sending domain

### 1. Install
```bash
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Fill in every value. `BETTER_AUTH_SECRET` must be at least 32 characters (`openssl rand -base64 32`).
`EMAIL_FROM` must use a domain verified in Resend.

> **Supabase:** set `DATABASE_URL` to the **Session pooler** connection string (Connect → Session pooler, port 5432). The direct `db.<ref>.supabase.co` host is IPv6-only, and Vercel and many local networks can't reach it.

### 3. Create the database schema
Create the better-auth tables:
```bash
npx @better-auth/cli migrate
```
Then create the app tables:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE albums (
  album_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_name text NOT NULL,
  user_id    text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE photos (
  photo_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name     text NOT NULL,
  user_id       text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  file_size     bigint NOT NULL,
  file_type     text NOT NULL,
  last_modified timestamptz NOT NULL,
  s3_key        text NOT NULL UNIQUE,
  width         integer,
  height        integer,
  album_id      uuid REFERENCES albums(album_id) ON DELETE SET NULL
);

CREATE TABLE tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id   uuid NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,
  category   text NOT NULL,
  label      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 4. Run
```bash
pnpm dev
```

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Run production server
pnpm lint       # Run ESLint
pnpm typecheck  # Type-check with tsc
pnpm test       # Run unit tests
```

## Project Structure

```
app/
├── api/                 # API routes (auth, upload, analyze)
├── home/                # Protected dashboard routes
│   ├── photos/          # Photo gallery
│   ├── albums/          # Album management
│   ├── upload/          # Upload page
│   ├── insights/        # AI analysis views
│   └── prefs/           # User preferences
├── lib/                 # Server libraries (db, auth, actions, types)
├── ui/                  # Reusable UI components
└── layout.tsx           # Root layout with providers
components/
└── ui/                  # shadcn/ui component library
```

## Deployment

Designed for Vercel deployment with:
- PostgreSQL database (Neon, Supabase, or self-hosted)
- AWS S3 bucket for image storage
- Environment variables configured in Vercel dashboard

## License

[MIT](LICENSE)