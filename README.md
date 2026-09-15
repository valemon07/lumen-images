# Lumen Images

A personal photo collection application built with Next.js 16, featuring secure cloud storage, album organization, and AI-powered image analysis.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Authentication | better-auth (email/password) |
| Database | PostgreSQL (postgres + pg) |
| Storage | AWS S3 (presigned URLs) |
| AI Analysis | Google GenAI (Gemini 2.5 Flash) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Tooling | ESLint, pnpm |

## Features

- **Secure Authentication** — Email/password with session management
- **Photo Upload** — Direct-to-S3 uploads with metadata persistence
- **Album Organization** — Create and manage photo albums
- **AI Image Analysis** — Gemini-powered content analysis (rate limited)
- **Presigned URLs** — Secure, time-limited image access
- **Responsive UI** — Mobile-first design with dark mode support

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Run production server
pnpm lint       # Run ESLint
```

## Project Structure

```
app/
├── api/                 # API routes (auth, upload, analyze, delete)
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