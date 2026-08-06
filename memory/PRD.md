# PRD — Cinematic Video Editing Portfolio

## Original problem statement
"build me a cool video editing portfolio website"

## User choices
Personal portfolio · Mix of everything (film/social/commercial) · Sections: Hero + Portfolio + About + Contact · Vibe: Dark & cinematic · Features: inline video showreels, contact form that emails, displayed contact info.

## Architecture
- Frontend: React 19 + Tailwind, framer-motion (kinetic reveals, parallax, scroll-reveals), lenis (momentum scroll), sonner toasts.
- Backend: FastAPI + MongoDB. `/api/contact` (POST saves + emails owner, GET lists). Email via Emergent-managed Resend.
- Design: dark "cinematic brutalist" — Bebas Neue / Cormorant Garamond / JetBrains Mono / IBM Plex Sans, Signal Red #FF2A00 accent, grain overlay.

## Implemented (2026-08-06)
- Kinetic hero with masked line-by-line reveal, parallax bg, meta bar, showreel modal.
- Editorial marquee ribbon.
- "Cutting Room" bento work grid (6 projects) with hover video previews + click-to-play lightbox.
- About: parallax portrait, stats, 3 numbered manifesto chapters.
- Contact: big type + copyable email/socials + form (name/email/project-type chips/message) emailing owner.
- Footer, fixed nav with glass-on-scroll, mobile menu, noise overlay.

## Notes / MOCKED
- Portfolio videos use public sample MP4s (Google demo bucket) as placeholders for real reels.
- OWNER_EMAIL is `delivered@resend.dev` (test placeholder) — must be swapped for the owner's real inbox.

## Backlog
- P1: real showreel/video uploads (object storage), replace sample MP4s.
- P1: set real owner email + real project details/copy.
- P2: per-project detail pages, filterable categories, client logos.
