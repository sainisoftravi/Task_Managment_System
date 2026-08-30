# Task & Ticket Management System

A full-stack, unified Ticket & Project Management web application inspired by Zoho Desk and Zoho Projects.

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** (via Docker or local installation) OR **SQLite** (local dev only)

## Quick Start (SQLite - No External Dependencies)

For rapid local development without PostgreSQL:

```bash
# 1. Install dependencies
npm install

# 2. Database is already set up with SQLite (file:./dev.db)
#    Push schema to database (creates dev.db)
npm run prisma:push

# 3. Seed the database
npm run db:seed

# 4. Start the dev server
npm run dev

# 5. (Optional) Start the WebSocket server for real-time updates
npm run ws:dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with:
- **Email:** `admin@taskpmp.local`
- **Password:** `admin123`

## Production Setup (PostgreSQL)

For production or full PostgreSQL support:

### Option A: Using Docker Compose

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Update environment
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/taskpmp?schema=public"' > .env.local
cp .env.local .env

# Push schema
npm run prisma:push

# Seed
npm run db:seed

# Start
npm run dev
```

### Option B: Local PostgreSQL

1. Install PostgreSQL 15+ from [postgresql.org](https://www.postgresql.org/download/)
2. Create database and user:
   ```sql
   CREATE USER postgres WITH PASSWORD 'password' SUPERUSER;
   CREATE DATABASE taskpmp OWNER postgres;
   ```
3. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/taskpmp?schema=public"
   ```
4. Run:
   ```bash
   cp .env.local .env
   npm run prisma:push
   npm run db:seed
   npm run dev
   ```

## Project Structure

```
Task&PMP-System/
├── prisma/
│   ├── schema.prisma         # Database schema (PostgreSQL or SQLite)
│   ├── seed.ts               # Database seed script
│   └── tsconfig.json         # TSConfig for seed
├── src/
│   ├── app/
│   │   ├── api/              # RESTful API routes (App Router)
│   │   │   ├── auth/         # Authentication (login, register)
│   │   │   ├── tickets/      # Ticket CRUD + comments + KB + time-logs
│   │   │   ├── projects/     # Project CRUD + WBS
│   │   │   ├── tasks/        # Task CRUD + dependencies
│   │   │   ├── task-lists/   # Task list management
│   │   │   ├── time-logs/    # Time tracking
│   │   │   ├── sla/          # SLA policies + engine runner
│   │   │   ├── kb/           # Knowledge base CRUD
│   │   │   ├── bridge/       # Ticket-to-task conversion (2-way sync)
│   │   │   ├── dashboard/    # Dashboard analytics
│   │   │   └── reports/      # Reporting endpoints
│   │   ├── dashboard/        # Dashboard page
│   │   ├── tickets/          # Ticket pages (list, detail, new)
│   │   ├── projects/         # Project pages (list, overview, tasks)
│   │   ├── time-tracking/    # Time tracking page
│   │   ├── kb/               # Knowledge base page
│   │   └── reports/          # Reports page
│   ├── components/
│   │   ├── kanban/           # Drag-and-drop Kanban board
│   │   ├── gantt/            # Interactive Gantt chart with dependencies
│   │   ├── projects/         # WBS view, task list view
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # Auth and WebSocket React contexts
│   ├── hooks/                # Custom hooks (useWebSocket, etc.)
│   ├── lib/                  # Server utilities (prisma, auth, utils, SLA engine, ws server)
│   └── types/                # TypeScript type definitions
├── middleware.ts             # Route protection middleware
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── docker-compose.yml
```

## Available Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start Next.js development server     |
| `npm run build`    | Build for production                 |
| `npm run start`    | Start production server              |
| `npm run lint`     | Run ESLint                           |
| `npm run typecheck`| Run TypeScript type checker          |
| `npm run prisma:push` | Push schema to database          |
| `npm run prisma:studio` | Open Prisma Studio              |
| `npm run db:seed`  | Seed database with test data         |
| `npm run ws:dev`   | Start WebSocket server (port 3001)   |

## Architecture Overview

### Tech Stack
- **Frontend:** React 18, Next.js 15 (App Router), Tailwind CSS, Lucide Icons
- **Drag & Drop:** @hello-pangea/dnd (Kanban board)
- **Charts:** Custom SVG-based Gantt chart with dependency visualization
- **Backend:** Next.js Server Actions + RESTful API routes in App Router
- **Real-time:** WebSocket server (ws) on port 3001
- **Database:** PostgreSQL with Prisma ORM (SQLite for local dev)
- **Auth:** JWT-based with bcrypt password hashing

### Key Features

#### 1. Ticket Management (Help Desk)
- Full CRUD with priority, status, category, and source tracking
- Configurable SLA timers with auto-escalation triggers
- Internal private comments vs. public customer replies
- Conversation history timeline
- Parent-child ticket splitting
- Knowledge Base article attachment
- SLA breach detection and escalation

#### 2. Project Management
- Hierarchical WBS: Projects -> Milestones -> Task Lists -> Tasks -> Subtasks
- Interactive Kanban board with drag-and-drop status updates
- Gantt chart with Finish-to-Start (FS), Start-to-Start (SS), Finish-to-Finish (FF), and Start-to-Finish (SF) dependencies
- Time tracking with billable/non-billable distinction
- Weekly timesheet generation

#### 3. Unified Integration (Bridge)
- One-click ticket-to-task conversion
- Two-way sync: ticket status updates reflect in linked tasks and vice versa
- Maintains traceability between support and development teams

### API Endpoints

#### Tickets
| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | `/api/tickets`            | List tickets (with filters)    |
| POST   | `/api/tickets`            | Create ticket                  |
| GET    | `/api/tickets/:id`        | Get ticket detail              |
| PATCH  | `/api/tickets/:id`        | Update ticket                  |
| DELETE | `/api/tickets/:id`        | Delete ticket                  |
| GET    | `/api/tickets/:id/comments`| List comments                |
| POST   | `/api/tickets/:id/comments`| Add comment (public/private) |
| GET    | `/api/tickets/:id/kb`     | List linked KB articles        |
| POST   | `/api/tickets/:id/kb`     | Link KB article                |
| DELETE | `/api/tickets/:id/kb`     | Unlink KB article              |
| GET    | `/api/tickets/:id/time-logs` | List time logs              |
| POST   | `/api/tickets/:id/time-logs` | Add time log                |

#### Projects
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | `/api/projects`       | List projects           |
| POST   | `/api/projects`       | Create project          |
| GET    | `/api/projects/:id`   | Get project (full WBS)  |
| PATCH  | `/api/projects/:id`   | Update project          |
| DELETE | `/api/projects/:id`   | Delete project          |

#### Tasks
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| GET    | `/api/tasks`                | List tasks (with filters) |
| POST   | `/api/tasks`                | Create task               |
| GET    | `/api/tasks/:id`            | Get task detail           |
| PATCH  | `/api/tasks/:id`            | Update task               |
| DELETE | `/api/tasks/:id`            | Delete task               |
| GET    | `/api/tasks/dependencies`   | List dependencies         |
| POST   | `/api/tasks/dependencies`   | Create dependency         |
| DELETE | `/api/tasks/dependencies`   | Delete dependency         |

#### Integration
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| POST   | `/api/bridge/tickets-to-tasks` | Convert ticket to task |
| GET    | `/api/bridge/tickets-to-tasks` | Get linked entity     |

#### Analytics
| Method | Endpoint        | Description               |
|--------|-----------------|---------------------------|
| GET    | `/api/dashboard` | Dashboard data           |
| GET    | `/api/reports`   | Report data              |
| POST   | `/api/sla/run`   | Run SLA engine            |

## Seed Data

The seed script creates:
- 4 users: Admin, Support Agent, Dev Engineer, Project Manager
- 2 customers: Acme Corp, Globex Inc
- 3 SLA policies with escalation rules
- 3 Knowledge Base articles
- 2 projects: Website Redesign, Mobile App Development
- 4 tasks with Finish-to-Start dependencies
- 3 tickets with different priorities (High, Medium, Urgent)
- 2 comments (public + private threading)
- 4 time logs (billable/non-billable)

## Production Deployment Notes

To switch from SQLite to PostgreSQL:
1. Update `.env` with PostgreSQL connection string
2. Change `provider = "sqlite"` to `provider = "postgresql"` in `schema.prisma`
3. Add `@@map` and `@@index` as needed for PostgreSQL optimizations
4. Re-enable `mode: "insensitive"` in search queries for PostgreSQL
5. Run `npx prisma generate && npx prisma db push`
6. Set `JWT_SECRET` to a secure random value in production
