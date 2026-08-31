# TaskPMP Enterprise - Unified Ticket & Project Management System

**TaskPMP Enterprise** is a full-stack, unified Ticket & Project Management web application built with **Next.js 15**, **TypeScript**, **Prisma ORM**, **Tailwind CSS**, and **WebSocket** real-time updates.

---

## 🌟 Key Platform Features

### 1. ⚙️ Setup & Enterprise Settings Module (`/settings`)
- **Top Navigation Integration**: Click the Settings Gear Icon (`⚙️`) in the header to enter the Setup suite.
- **Setup Navigation Sidebar**: 12 enterprise administration categories:
  - `PERSONAL PREFERENCES` → Personal Settings
  - `NOTIFICATIONS` → Personal Email & Activity Reminder
  - `PORTAL CONFIGURATION` → Configuration, Business Calendar, Project Settings, Task Settings
  - `PROJECT CONFIGURATION` → Project Fields
  - `CUSTOMIZATION` → Custom Views & Templates
  - `AUTOMATION` → Workflow Rules
  - `ISSUE TRACKER` → Issue Layouts
  - `MARKETPLACE` → Integrations & Webhooks
  - `DEVELOPER SPACE` → REST APIs & Tokens
  - `DATA ADMINISTRATION` → Import / Export Data
  - `SANDBOX` → Developer Sandbox
  - `PROFILES AND ROLES` → Profiles & Roles Matrix

#### Personal Settings
- **User Profile**: Display name editing, language selection (`English`), contact metadata.
- **Themes & Styling**: Curated color palette (Orange, Light Blue, Teal, Red, Green, Dark Blue) and panel style pickers (Dark, Light, Gradient, Image).
- **Display Mode**: Toggle between `Day`, `Night`, and `Auto` modes.
- **Landing Page Preference**: Select primary landing module (`Home`, `Projects`, `Reports`, `Collaboration`).

#### Notification Matrix
- **Task Notifications**: Toggle matrix for *Assigned*, *Updated*, *Completed/Reopened*, *Commented on*, *Predecessor Task completion*, *Followed tasks*.
- **Phase & Forum Notifications**: Fine-grained notification controls for phase updates, announcement forums, and comment threads.
- **Email Frequency**: Configure delivery frequency (`Immediate`, `Daily Summary`, `Weekly Digest`).
- **Daily Digest Reminder**: Configure pending task/issue summary emails with daily/weekly frequency and hour/minute AM-PM pickers.

#### Portal Configuration
- Custom enterprise portal configuration with company name (`Digital Twin Solutions`), time zone (`Asia/Kolkata`), business hours, and custom domain URL (`https://taskpmp.local/portal/digitaltwin`).
- User display name format configuration (`First Name + Last Name` or `Last Name + First Name`).

#### 🛡️ Profiles & Roles Permission Matrix
- **User Profiles**: Interactive grid matrix for 7 organizational roles (*Developer, Admin, Manager, Contractor, Team Lead, QA, Employee*).
- **System Profiles**: Grid matrix for *Read Only* and *Viewer* system access.
- **Client Profiles**: External client portal permission matrix for *Client User*.
- **Module Permissions**: Granular action permissions (*View, Add, Edit, Trash, Reorder, Add Followers, Preview Blueprint, Associate Blueprint, Approve*) across *Task, Task List, Phase, Issue, Time Logs, Timesheet, Feed Status*.
- **Roles Hierarchy**: Tree hierarchy view (*Executive/Administrator → Project Manager → Team Lead → Developer / QA / Contractor / Employee*).

---

### 2. 👤 Interactive User Profile Popover Card
- Triggered by clicking the User Avatar or Name (`Ravi Saini`) in the top right navigation header.
- **Sign Out & Close**: Instant `← Sign Out` action and close `✕` button.
- **User Metadata**: Circular avatar badge with green online status indicator (`🟢`), full name, email, **TaskPMP User ID** (`906280277`), and **Organization ID** (`889826678` 📋 with one-click copy to clipboard).
- **Navigation Links**: Direct links to `My Accounts` (`/settings`) and `My Portals ▾` switcher.

---

### 3. 📌 Persistent Global Navigation Sidebar & Hide/View Panel Toggle
- Navigation sidebar persists across all layout routes (`/reports`, `/projects`, `/users`, `/kb`, `/tickets`, `/time-tracking`, `/settings`).
- Interactive **Hide / View Panel** collapse toggle button (`PanelLeftClose` / `PanelLeftOpen`) with `localStorage` memory preference.

---

### 4. 📋 Advanced Project & Task Management

#### Task Table Grid (`task-list-view.tsx`)
- **Blank Task State for New Projects**: Newly created projects render a clean, blank task table with an empty state placeholder instead of leaking demo tasks.
- **Interactive Calendar Pickers**: Native `<input type="datetime-local">` calendar pickers for Start Date and Due Date.
- **Auto-Duration & Overdue Counter**: Automatic calculation of Duration in hours and Overdue counter `(X day(s) and Y hour)`.
- **Duration Unit Selector Popover**: Interactive unit picker for `days` (work days), `hrs` (work hours), `cdays` (calendar days), `chrs` (calendar hours), and `mins` (minutes).
- **Inline Editing**: Double-click or type directly in table cells to rename Task Names and Project Names in real time.
- **Row Context Action Menus (`...`)**: Action menus for Tasks (*View Details, Copy Link, Color, Move, Clone, Trash*) and Projects (*Access Project, View Details, Copy Link, Color, Edit Project, Email Alias, Change Layouts, Trash*).
- **Group By Field Popover**: Group tasks dynamically by *Phases, Task List, Owner, Status, Dates, Priority, Tags, % Completion*.

#### ➕ Full New Task Creation Modal (`create-task-modal.tsx`)
- **Header Layout Selector**: Switch layouts (*Standard Layout, Software BugTracker, Construction WBS*).
- **Task Fields**: Required `Task Name*`, Rich Text Description toolbar (**B**, *I*, <u>U</u>, ~~S~~, Size 13, Lists, Code, Links), Task List selector, and Drag & Drop attachment zone (*Max 30 files*).
- **Task Information Accordion**: Owner selector dropdown, Start Date picker, Due Date picker with `Enter Duration` auto-calculator, Priority selector, and Reminder selector.
- **Action Buttons**: `[ Add ]` (saves & closes), `[ Add More ]` (saves & keeps modal open for batch task entry), `[ Cancel ]`.

#### 💬 Task Detail Drawer & Comment API (`/api/tasks/[id]/activities`)
- Side-drawer with title editing, live timer controls (*Play, Pause, Stop*), owner selector popover badge, status dropdown, start/due date pickers, priority selector, and completion percentage slider.
- `Comments` vs `Activity Stream` tabs with real-time comment submission, green success toast feedback, and dual persistence in Prisma database (`Activity` model) and `localStorage`.

---

### 5. 🎫 Ticket Management & Bridge Integration
- Ticket CRUD with priority, status, category, and source tracking.
- Configurable SLA timers with auto-escalation triggers and SLA breach detection.
- **Ticket-to-Task Bridge**: Two-way sync where ticket status updates reflect in linked tasks and vice versa.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **Docker** & **Docker Compose** (for PostgreSQL) OR **SQLite** (local development)

### 1. SQLite Development Setup (No External Dependencies)

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma schema to SQLite database (dev.db)
npm run prisma:push

# 3. Seed test data (PoC projects and spreadsheet task dataset)
npm run db:seed

# 4. Start Next.js dev server
npm run dev

# 5. (Optional) Start WebSocket server for real-time updates
npm run ws:dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with:
- **Email:** `admin@taskpmp.local`
- **Password:** `admin123`

---

### 2. Docker Compose Setup (PostgreSQL + Redis + Next.js App)

```bash
# Build and start all services in background
docker compose up -d --build

# View service logs
docker compose logs -f app
```

Services started:
- `taskpmp-app`: Next.js web application (Port 3000)
- `taskpmp-postgres`: PostgreSQL database (Port 5432)
- `taskpmp-redis`: Redis cache (Port 6379)

---

## 🛠️ Project Structure

```
Task&PMP-System/
├── prisma/
│   ├── schema.prisma         # Database schema (PostgreSQL & SQLite compatible)
│   ├── seed.ts               # Database seed script with PoC project dataset
│   └── tsconfig.json         # TSConfig for Prisma seed
├── src/
│   ├── app/
│   │   ├── api/              # RESTful API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── projects/     # Project CRUD & WBS
│   │   │   ├── tasks/        # Task CRUD, dependencies, activities
│   │   │   ├── tickets/      # Ticket CRUD, comments, KB, time logs
│   │   │   ├── bridge/       # Ticket-to-Task bridge sync
│   │   │   ├── dashboard/    # Analytics data
│   │   │   └── reports/      # Reporting data
│   │   ├── dashboard/        # Dashboard view
│   │   ├── projects/         # Projects list & project overview
│   │   ├── settings/         # Setup & Settings module (/settings)
│   │   ├── tickets/          # Help desk tickets view
│   │   ├── time-tracking/    # Time logs and timesheets view
│   │   ├── users/            # Users and team members view
│   │   ├── kb/               # Knowledge base & collaboration
│   │   └── app-layout.tsx    # Persistent global layout & top header
│   ├── components/
│   │   ├── projects/         # Task list view, create task modal, task detail drawer
│   │   ├── kanban/           # Drag-and-drop Kanban board
│   │   ├── gantt/            # Interactive Gantt chart
│   │   ├── notifications/    # Notification drawer
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # AuthContext & WebSocket Context
│   ├── lib/                  # Prisma client, auth, SLA engine, WS server
│   └── types/                # TypeScript type definitions
├── middleware.ts             # Route protection middleware
├── docker-compose.yml        # Docker compose configuration
└── README.md                 # Project documentation
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server (Port 3000) |
| `npm run build` | Build production application bundle |
| `npm run start` | Start Next.js production server |
| `npm run lint` | Run ESLint static code checker |
| `npm run typecheck` | Run TypeScript type checker (`tsc --noEmit`) |
| `npm run prisma:push` | Push schema changes to database |
| `npm run prisma:studio` | Open Prisma Studio database viewer (Port 5555) |
| `npm run db:seed` | Populate database with PoC test data |
| `npm run ws:dev` | Start standalone WebSocket server (Port 3001) |

---

## 🔑 Default Login Credentials

- **Admin User:** `admin@taskpmp.local` / `admin123`
- **Support Agent:** `support@taskpmp.local` / `support123`
- **Project Manager:** `pm@taskpmp.local` / `pm123`
- **Dev Engineer:** `dev@taskpmp.local` / `dev123`

---

## 🔒 Enterprise Brand Neutrality
This codebase enforces **TaskPMP Enterprise** brand neutrality. All UI components, documentation, API contracts, and database seed scripts contain zero third-party vendor names.
