# AGENTS.md - Task & Ticket Management System

## Project Overview
A full-stack unified Ticket & Project Management system built with Next.js 15, TypeScript, Prisma, and Tailwind CSS. Integrates help-desk ticketing with project management via a ticket-to-task bridge.

## Project Commands

### Running the Application
```bash
npm run dev         # Start development server (port 3000)
npm run build       # Build for production
npm run start       # Start production server
npm run ws:dev      # Start WebSocket server (port 3001)
```

### Database
```bash
npm run prisma:push  # Push schema to database
npm run prisma:studio  # Open Prisma Studio (port 5555)
npm run db:seed      # Seed database with test data
```

### Code Quality
```bash
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checker
```

## Architecture

### Tech Stack
- **Frontend:** React 18, Next.js 15 (App Router), Tailwind CSS, Lucide Icons
- **Drag & Drop:** @hello-pangea/dnd
- **Backend:** Next.js App Router API routes (RESTful)
- **Real-time:** WebSocket server via `ws` on port 3001
- **Database:** PostgreSQL with Prisma ORM (SQLite for local dev)
- **Auth:** JWT with bcrypt password hashing

### Directory Structure
```
src/
  app/          # Next.js App Router (pages + API routes)
    api/        # RESTful API endpoints
    dashboard/  # Dashboard page
    tickets/    # Ticket pages (list, detail, new)
    projects/   # Project pages (list, overview, tasks)
    time-tracking/
    kb/
    reports/
    login/
    register/
  components/
    kanban/     # Drag-and-drop board
    gantt/      # Interactive Gantt chart
    projects/   # WBS and task views
    ui/         # Reusable components
  contexts/     # Auth + WebSocket React contexts
  hooks/        # Custom hooks
  lib/          # Server libraries (prisma, auth, SLA, ws)
  types/        # TypeScript types
```

### Key Integrations
1. **SLA Engine** (`src/lib/sla-engine.ts`): Calculates breach times, triggers escalations, runs on a timer
2. **WebSocket Server** (`src/lib/ws-server.ts`): Broadcasts real-time updates for ticket/task changes
3. **Ticket-to-Task Bridge** (`src/app/api/bridge/`): Creates tasks from tickets, syncs status bidirectional

### Auth
- All routes (except `/login` and `/register`) are protected by `middleware.ts`
- JWT stored in `next-auth/session` cookie
- Passwords hashed with bcryptjs

### Seed Data
Run `npm run db:seed` to populate:
- 4 users (Admin, Support, Dev, PM)
- 2 customers, 3 SLA policies, 3 KB articles
- 2 projects, 4 tasks, 3 tickets, 2 comments, 4 time logs

Login: `admin@taskpmp.local` / `admin123`
