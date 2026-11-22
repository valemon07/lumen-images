# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Hobbyist photographers who shoot a lot and want AI analysis (subjects, setting, mood, composition) to understand and sort their own work. Lumen is also a portfolio piece showing the author's engineering to recruiters and peers, so first impressions and polish carry extra weight.

## Product Purpose
A private photo collection where each user uploads images, groups them into albums, and gets Gemini-powered tags rolled up into an insights dashboard. Success: users learn what they actually shoot (recurring subjects, moods, settings) and can find and group work by those traits.

## Positioning
AI insight is the point. A plain library (Google Photos, iCloud) stores and searches. Lumen analyzes what is in each photo and shows patterns across the whole collection on the insights dashboard.

## Operating Context
- Web app: public landing page and auth pages (signup, login, email verification, password reset); signed-in area under `/home` (photos, albums, album detail, upload, insights, prefs).
- Uploads: JPEG/PNG/WebP, 20 MiB max, stored privately in S3, served with 1-hour presigned URLs.
- Analysis: on-demand Gemini Flash tagging, limited to 10 requests per minute per user.
- Supports light and dark mode (follows the system setting by default).

## Capabilities and Constraints
- Email/password auth (better-auth) with verification and reset emails sent through Resend.
- Free; no pricing or paid plans now or planned for the near term.
- Live and deployed, but no real users yet.
- Each user sees only their own photos; there is no sharing or public galleries.

## Brand Commitments
- The name "Lumen" is final.
- The lightning-bolt mark is not a commitment and may be replaced.

## Evidence on Hand
No users yet, so there are no testimonials, usage numbers or customer logos. Future work must not invent any. No product screenshots or demo photo set are in the repo yet.

## Product Principles
1. Insight over storage: features and screens should help people understand their photos, not just hold them.
2. The photos come first: user images are the main content, and the interface supports them.
3. Private by default: a collection belongs to its owner, and nothing suggests otherwise.
4. Portfolio-grade craft: every surface may be seen by someone judging the work, so finish quality matters.

## Accessibility & Inclusion
Target: WCAG 2.2 AA across all surfaces, in both light and dark mode.
