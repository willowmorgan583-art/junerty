# Platform - Modern Business Dashboard

A production-ready, full-stack web application built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Features

- **Modern UI & Dark Mode** - Polished responsive design with seamless light/dark/system theme toggle
- **High-Conversion Landing Page** - Animated landing page funneling users to auth
- **Authentication** - Login, Registration, Forgot Password with NextAuth (Auth.js v5)
- **Admin Dashboard** - Charts, metrics, user management, and analytics
- **Task Management** - Full CRUD, Kanban + List views, status workflow, task assignment
- **Profile & Settings** - User profile page and theme preferences
- **Global Search** - Cmd+K search bar (placeholder)
- **Notifications** - Dropdown with notification list

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Radix UI
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js v5 (Auth.js)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or use [Prisma Postgres](https://www.prisma.io/docs/prisma-postgres) for local dev)

### Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `DATABASE_URL` - PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/platform`)
   - `AUTH_SECRET` - Generate with `openssl rand -base64 32`

3. **Database**
   ```bash
   npm run db:push    # Push schema (dev)
   npm run db:seed    # Seed demo users (admin@platform.dev / user@platform.dev, password: password123)
   # or: npx prisma migrate dev  # For migrations
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Database Options

**Standard PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/platform?schema=public"
```

**Prisma Postgres (local):**
```bash
npx prisma dev
```
Uses `prisma+postgres://` URL from `.env`.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── profile/
│   │   └── settings/
│   ├── auth/            # Login, register, forgot-password
│   └── api/auth/        # NextAuth + auth APIs
├── actions/             # Server Actions
├── components/
│   ├── ui/              # shadcn-style components
│   ├── tasks/           # Task management components
│   └── dashboard/       # Chart components
├── lib/                 # Prisma, utils
└── auth.ts              # NextAuth config
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Push Prisma schema
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Prisma Studio

## License

MIT
