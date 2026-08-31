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
- **Project Row Options Menu (`...`)**:
  - Full 10-item context menu window matching Screenshots 2 & 3: `Access Project`, `Access Project in New Tab`, `View Details`, `View Details in New Tab`, `Copy Link`, `Color`, `Edit Project`, `Email Alias`, `Change Layouts`, `Trash` (red text).
  - Floating `z-50` window position over all table elements without container clipping (`min-h-[400px]` scroll buffer) with backdrop click-outside dismissal.

#### Task Table Grid (`task-list-view.tsx`)
- **Blank Task State for New Projects**: Newly created projects render a clean, blank task table with an empty state placeholder instead of leaking demo tasks.
- **Interactive Calendar Pickers**: Native `<input type="datetime-local">` calendar pickers for Start Date and Due Date.
- **Auto-Duration & Overdue Counter**: Automatic calculation of Duration in hours and Overdue counter `(X day(s) and Y hour)`.
- **Duration Unit Selector Popover**: Interactive unit picker for `days` (work days), `hrs` (work hours), `cdays` (calendar days), `chrs` (calendar hours), and `mins` (minutes).
- **Inline Editing**: Double-click or type directly in table cells to rename Task Names and Project Names in real time.
- **Row Context Action Menus (`...`)**: Action menus for Tasks (*View Details, Copy Link, Color, Move, Clone, Trash*) and Projects (*Access Project, View Details, Copy Link, Color, Edit Project, Email Alias, Change Layouts, Trash*).
- **Comprehensive Trash & Delete Engine**:
  - **Task Row Menu**: `Trash` option in task table rows (`task-list-view.tsx`) triggers real `DELETE /api/tasks/${id}` API calls with confirmation dialogs and immediate UI state removal.
  - **Task Detail Drawer**: Header `Trash` icon button (`task-detail-drawer.tsx`) next to close `X` allowing instant deletion when inspecting tasks.
  - **Kanban Board Cards**: Hover `Trash` icon on Kanban cards (`kanban-board.tsx`) for quick deletion.
  - **Milestone Task Lists**: `Trash` action in Milestone details drawer (`milestone-details-drawer.tsx`) for Task Lists.
- **Group By Field Popover**: Group tasks dynamically by *Phases, Task List, Owner, Status, Dates, Priority, Tags, % Completion*.
- **Interactive Kanban Drag & Drop Engine (`kanban-board.tsx`)**:
  - **Status Normalization**: Automatic normalization mapping between database task statuses (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `BLOCKED`, `DONE`) and human-readable labels (`"To Do"`, `"not yet Started"`, `"Open"`, `"Completed"`, `"Closed"`).
  - **Optimistic Drag State**: Instant visual card movement across columns upon drop with background API synchronization (`PATCH /api/tasks/${id}`).
  - **Expanded Droppable Targets**: `min-h-[300px]` drop target height ensuring empty status columns (*In Progress*, *Blocked*, *Done*) have large drop targets.
- **Task Details Page & Interactive Central Hub (`task-detail-drawer.tsx`)**:
  - **Left Checklist Side Panel**: Quick task checklist switcher displaying task key badges (`DC-T1197`), status, task titles (`Installation`), assignees, and timer/priority indicators matching Screenshots 1 & 2.
  - **Header Meta & Actions**: Task key badge, title editor, author (`Monica Hemsworth`), project link, reminder trigger (`🔔`), chat discussion (`💬`), attachments (`📎`), live timer (`⏱️`), dependency status (`-(1)`), info button (`ℹ️`), and top-right `...` popover (*Copy Link*, *Follow Task*, *Associate Blueprint*, *Execute Macro Rule*, *Delete Task*).
  - **Status & Blueprint Banner**: Current status dropdown (`Open 🔒`), next transition action button (`D&P analysis`), and blueprint preview link (`Budget Approval Process`).
  - **Full Sub-Tabs Bar**: `Comments`, `Subtasks`, `Log Hours (06:02)`, `Documents`, `Invoices`, `Forums`, `Dependency (1)`, `Issues`.
  - **Email Comment Alias**: Red highlighted link **`To add Task Comment via email 📋`** opening dialog with task email alias (`task-dc-t1197@reply.taskpmp.app`) and direct email posting.
  - **Default Task Information Fields**: `Associated Team` badges, `Owner` pills, `Work Hours`, `Status` dropdown, `Start Date`, `Due Date`, `Duration` (validated <= 10 yrs), `Priority`, `Completion Percentage`, `Tags`, `Reminder` modal (*Daily*, *On a Date*, *Before a Date*, *After a Date*), `Recurrence`, and `Billing Type`.
  - **Recurring Tasks Schedule & Manage Fields Modal (`task-detail-drawer.tsx`)**:
    - **Recurrence Popover**: Schedule repeat rules (*Daily*, *Weekly*, *Monthly*, *Yearly*, *After*), reference fields (*Due Date*, *Start Date*, *Schedule*), intervals, end conditions (*On date*, *After instances*, *Never*), holiday handling (*Execute on previous working day*, *Execute on next working day*, *Skip holiday*), and triggers (*On Completion*, *On Schedule*, *First to Occur*) with mini-calendar preview matching Screenshot 1.
    - **Manage Fields for Recurring Task Modal**: Red highlighted link **`Manage fields for recurring task (N)`** opening modal matching Screenshot 2 to include/exclude *Comments*, *Subtasks*, *Billing Type*, *Followers*, *Description*, *Tags*, *Attachments*, and *Associated Teams*.
  - **Task Reminders Popover & Modal (`task-detail-drawer.tsx`)**:
    - Reminder type selector (*Before*, *After*, *On due date*, *On a Date*), interval counter & unit (*days*, *hours*), reference field (*Due Date*, *Start Date*, *Created Date*), time picker, multi-select user/team pills, and **`Create mail template`** red link trigger matching Screenshot 3.
  - **Standard & Flexible Work Hours**: Supports planned work hours per day, work % per day, total work hours, and flexible custom daily allocations across task schedules.
  - **File Annotation & Attachment Upload**: Document tab with **`Annotate File 📝`** markup canvas modal and multi-cloud source tabs matching Screenshot 3.
  - **Associate Blueprint & Issues Modals**: Blueprint mapping popover matching Screenshot 4, and Issue association modal.
- **Collaboration Hub & Knowledge Base (`collaboration/page.tsx` & `kb/page.tsx`)**:
  - **Team Status Feed**: Live announcements, post publishing, team updates, tags, likes, and comment replies.
  - **Project Discussion Forums**: Categorized discussion topics (*Technical & Architecture*, *Client Delivery*, *General*), replies count, view counts, and topic creation modal.
  - **Step-by-Step Learning Materials Center**: Category filter pills (*All Modules*, *Project Management*, *Workflow Rules*, *Time Tracking*, *Help Desk*, *Setup*) with rich learning guides detailing features, primary business uses, prerequisites, numbered execution steps (1, 2, 3, 4...), and best practices.
  - **Interactive Learning Drawer Modal**: Clicking any KB card slides out a reader drawer with step-by-step instructions, code snippets, and feedback options.
- **My Approvals Hub & Panel Collapse Controls (`my-approvals/page.tsx` & `app-layout.tsx`)**:
  - **Timesheet Submissions Review**: Full interactive management for employee timesheet submissions (*Approved*, *Pending*, *Rejected*, *All Timesheets*), approve/reject actions, comment prompt, and recall to draft.
  - **Side Panel Toggle Button**: The left sidebar hide/expand panel toggle button (`PanelLeftOpen` / `PanelLeftClose`) is available across all main navigation pages including `/my-approvals`.
- **Home Dashboard Real-Time Live Metrics (`dashboard/page.tsx`)**:
  - **Dynamic Metrics Calculation**: `buildLiveDashboardData` merges server API metrics with live client data (`user_custom_tasks`, `user_custom_projects`, `deleted_task_ids`, `deleted_project_ids`, `user_time_logs` from `localStorage`).
  - **Real-Time KPI Cards**: **Open vs. Closed Items** card (`[N] Open / [M] Closed`), **Calculated Resolution Rate** (`[X]%`), **Priority Breakdown Doughnut Chart**, and **Project Progress** automatically reflect all real-time created, completed, and deleted projects & tasks.
- **Robust Project Creation & Dual Persistence (`projects/page.tsx`)**:
  - **Auto Sequential Project Key**: Opening `+ New Project` calculates the highest existing project key (`DT-31`) and automatically pre-fills the `Project Prefix / ID (Key)` field with the next sequential ID (e.g. `DT-32` or `DT-01`, `DT-02` sequentially).
  - **Fail-safe Creation Flow**: Clicking `Save Project` performs full validation, sends project data to `/api/projects` POST endpoint, and immediately creates/adds the new project to the top of the Projects table with success toast notification (`Project '[name]' created successfully!`).
  - **Dual Persistence & Blank Project Isolation**: Project entries persist in Prisma database (`Project` model) and `localStorage.setItem("user_custom_projects", ...)`, guaranteeing newly created projects start with clean empty task lists (`0 tasks`, `0% progress`, `+$0 budget surplus`) and preserve custom Task Lists (`custom_task_lists`) created via `New Task List` modal.
- **Task Custom Views & Column Customizer (`task-list-view.tsx`)**:
  - **Custom Views Popover**: Search views, predefined views (*Today's Tasks*, *Tasks I Follow*, *Tasks Created By Me* ★), *My Custom Views*, *Shared Views*, and **`+ Create Custom View`** red link trigger matching Screenshot 4.
  - **Custom View Actions Menu**: `Edit`, `Copy Link`, `Delete`, `Clone`, `Set as default view` context popover menu matching Screenshot 4.
  - **Create / Edit Custom View Builder**: Multi-criteria condition builder with `AND`/`OR` operators, name & description, column customizer dual list (*Available* vs *Selected* matching Screenshot 1), sharing settings (*All Users* vs *Specific Users* matching Screenshot 2), and accessibility scope (*Global Overview* / *Other Projects*).
  - **Add Column Drawer**: Slide-out column customizer drawer matching Screenshot 3 with search, column cards (*Multi select pick list*, *EURO*, *Date for Promotion*, *Estimated Dates*, *Site Visit Date*), and red highlighted **`+ Create Custom Field`** bottom button.
- **Task Layouts & Fields Customization (`settings/page.tsx`)**:
  - **New Fields Palette**: Full drag-and-drop palette (`Single-Line`, `Multi-Line`, `Pick List`, `Multi Select`, `User Pick List`, `Multi User`, `Date`, `Date & Time`, `Checkbox`, `Currency`, `Percentage`, `Number`, `Decimal`, `Formula`, `Email`, `Phone`, `URL`) with `+ Add Section` button and remaining fields counter (`Remaining Fields: 254`).
  - **Associated Team Field**: Removable default field highlighted in red on Task Information layout canvas matching Screenshot 1, with multi-team assignment across task details, list/kanban views, and bulk actions.
- **Task Automation Email Templates & Alerts (`settings/page.tsx`)**:
  - **Create Email Template**: Template builder matching Screenshot 2 with Organization Name (`Digital Twin Solutions`), Layout Name selector, Subject placeholder insert dropdown (`${Task.Associated_Team}`, `${Task.Name}`, `${Task.Number}`, `${Task.Due_Date}`, `${Task.Owner}`), and rich text body editor.
  - **Email Alerts**: Automated email triggers with `Associated Team` recipient notifications.
- **Portal Configuration (`settings/page.tsx`)**:
  - **Portal Profile**: Header displaying organization name (`Digital Twin Solutions`), logo badge, Time Zone (`Asia/Kolkata`), Business Hours (`Standard Business Hours`), Email Encoding (`UTF-8`), and Web Address (`https://taskpmp.app`).
  - **Portal URL Change**: Interactive portal URL slug manager (`https://taskpmp.app/portal/digitaltwin`), slug edit input, `[ Save URL ]` button, redirect warning note, and Admin permission indicator.
  - **Prefix & ID**: Configure global portal Project Prefix (`DT`, `PR`, `TS`), with `[ Update ]` button and `localStorage.setItem("portal_project_prefix", ...)` persistence.
  - **Tags**: Toggle switch for global tagging across projects, milestones, task lists, tasks, issues, and status.
  - **Project Completion Percentage**: Radio options (*Task & Issue count*, *Task completion % & Issue count* with yellow sub-options for roll-up/non-roll-up projects, *Task & Issue weightage*).
  - **Phase Completion Type**: Radio options (*Allow completion with open tasks*, *Display warning*, *Restrict phase completion*).
- **Workflow Rules & Automation Engine (`settings/page.tsx`)**:
  - **Workflow Rules Table**: Full rule registry matching Screenshot 1 (*Notify Owner on Task Assignment*, *Notify Follower*, *Remind Task Owners on Due Date*, *Assign Task to Project Owner*, *Qatar Demo Kit Flow*).
  - **Visual Flow Diagram Canvas**: Interactive canvas builder matching Screenshots 2-5 with `WHEN` circle node and `CONDITION 1` diamond node connected by dotted flow lines.
  - **Trigger & Criteria Configuration**: Configure `Based on User action` / `Based on Date & Time`, trigger action pickers (`is Created`, `is Updated`, `is Commented on`, `is Trashed`, `Document is attached`), multi-field change selectors (*Owner*, *Status*, *Start Date*, *Due Date*, *Duration*, *Priority*, *Completion Percentage*, *Tags*, *Work Hours*, *Completion Date*, *Billing Type*, *Associated Team*, *Task Name*, *Task Description*, *Clear Dates*), and `+ Add Row` multi-trigger chaining.
  - **Condition 1 - Criteria Builder**: Searchable field dropdown (*Project Name*, *Project Owner*, *Project Start/End Date*, *Project Status*, *Task Priority*), operator selector (*Is*, *Is Not*, *Contains*, *Doesn't Contains*, *Starts With*, *Ends With*), project value picker (*DT-21 01 PoC Projects*, *DT-31 07 Command Center Automation*), and `(+)` criteria row adding/branching.
  - **Action Association Popover**: Interactive **`+ Add Action`** popover menu matching screenshot with options: *Update Field*, *Associate Webhook*, *Associate Custom Function*, *Associate Email Alert*, and *Associate WhatsApp Notification*, with configured action badges and deletion controls.

#### ➕ Full New Task Creation Modal (`create-task-modal.tsx`)
- **Header Layout Selector**: Switch layouts (*Standard Layout, Software BugTracker, Construction WBS*).
- **Task Fields & Respective Project Task List Binding**: Required `Task Name*`, Rich Text Description toolbar (**B**, *I*, <u>U</u>, ~~S~~, Size 13, Lists, Code, Links), dynamic **Task List selector** automatically synchronized with the project's task lists (`taskLists={localTaskLists}`), and Drag & Drop attachment zone (*Max 30 files*).
- **Task Creation & Persistence**: Clicking `[ Add ]` or `[ Add More ]` validates `Task Name*`, creates the task with formatted dates and priority, adds it to the active task list table with success toast notification (`Task '[name]' created and added successfully!`), and persists to `localStorage.setItem("user_custom_tasks", ...)` across page refreshes.

#### 💬 Task Detail Drawer & Comment API (`/api/tasks/[id]/activities`)
- Side-drawer with title editing, live timer controls (*Play, Pause, Stop*), owner selector popover badge, status dropdown, start/due date pickers, priority selector, and completion percentage slider.
- `Comments` vs `Activity Stream` tabs with real-time comment submission, green success toast feedback, and dual persistence in Prisma database (`Activity` model) and `localStorage`.

---

### 5. 🎫 Ticket Management & Bridge Integration
- Ticket CRUD with priority, status, category, and source tracking.
- Configurable SLA timers with auto-escalation triggers and SLA breach detection.
- **Ticket-to-Task Bridge**: Two-way sync where ticket status updates reflect in linked tasks and vice versa.

---

### 6. 👥 Portal Users & Teams Management (`/users`)
- **Portal Users List & Grid View**: Filter active/deactivated portal members, role/cost/rate management, bulk deactivation, and bulk user updates.
- **Sidebar Invite Button**: Permanent `[ 👥 Invite Users ]` button pinned to sidebar footer across all application views.
- **Teams List, Grid & Details View**: Create up to 50 custom enterprise teams with Team Lead, Team Email Alias (`support@taskpmp.local`), and interactive Associated Projects tag popover.
- **Teams Details Drawer**:
  - **Overview Tab**: 4 SVG Donut Ring Chart Widgets (*Tasks, Issues, Phases, Team Users*).
  - **Fields & Activity Stream Tabs**: Detailed team parameters and activity log.

---

### 7. 📊 Time Tracking, Schedule Export & Custom Views (`/time-tracking`)
- **Real File Exports**: Browser downloads for `.xlsx`, `.csv`, and `.pdf` files.
- **Schedule Export Suite**:
  - Header links `[ Manage Schedule ]` and `[ Show Export History ]`.
  - Date Range modes (*Last*, *Current*, *Custom* with `From *` and `To *` date pickers).
  - Dual Column Transfer List (*Available* vs *Selected* with `MOVE ALL >` and `< MOVE ALL`).
  - `Schedule this Export` toggle switch with `Schedule Name*`, `First Run Date*`, and `Repeat Type` (*Once*, *Daily*, *Weekly*, *Monthly*).
  - Setup Suite Integration: `Setup > Notifications > Schedule Export` table with `OFF/ON` switch, `RUN NOW` button, `LAST DAY RUN`, and `NEXT RUN` tracking.
- **Time Log Custom Views & Column Customizer**:
  - Predefined and Favorite Custom Views (`⭐ Timesheets Pending Approval`).
  - `Create Custom View` builder with up to 15 criteria fields (*Approval Status, User, Log Date, Billable Type, Project*), `Share Custom View` options (*All Users / Specific Users*), and `Accessibility` settings (*All Projects / Specific Projects*).
  - `Add Column` right drawer with real-time search and `+ Create Custom Field` button.
  - `Time Log Filter Drawer` with `Log Users` accordion, user list checkboxes, and match logic (`Any of these` / `All of these`).
- **My Timesheet 7-Day Visual Widget & User-Wise Export (`/dashboard`)**:
  - 7-day visual bar chart summary (*Wed - Tue*) for billable and non-billable hours.
  - Summary totals row (*Billable*, *Non Billable*, *Total*).
  - Action buttons: `+ Add Log Time`, `📅 Weekly Log Time`, `Filter`, and `Export User Data` (generates user-wise CSV/XLSX export).
  - Adjacent `My Phases` widget showing overdue project phases.

---

### 8. ✍️ Timesheets & My Approvals Module (`/my-approvals`)
- **Timesheet Creation & Grouping**:
  - `Create Timesheet` modal with parameters: `Time Period*`, `Log Users*`, `Project*`, `Customer`, `Billing Type`.
  - Multi-select grouping from Time Logs list via yellow bulk action bar `[ Create Timesheet ]` button.
  - Daily hour matrix builder with `Add Row`, `Save as Draft`, and `Send for Approval`.
- **My Approvals View (`/my-approvals`)**:
  - Main navigation sidebar item **`✍️ My Approvals`**.
  - Category filters (*Approved*, *Pending Approval*, *Rejected*, *All Timesheets*).
  - Table columns matching design spec: `TIMESHEET NAME`, `TIME PERIOD`, `PROJECT NAME`, `BILLING TYPE`, `TOTAL HOURS`, `APPROVAL STATUS`, `ACTIONS`.
  - Hover `[ ⇄ View ]` detail drawer with audit stream trail.
  - Approval Workflow: `Approve`, `Reject` (with rejection prompt comments), `Recall` (reverts Pending timesheet to Draft), and `Delete`.

---

### 9. 📑 Task Lists & Visual Chart View (`/projects/[id]`)
- **Task List Grouping**: Group tasks into milestone-aligned task lists (e.g., `Walk-through check list (13)`).
- **Template Pre-built Task Lists**:
  - *Architecture Use Case*: Floor plan, front elevation, side elevation, and interior designs.
  - *HR Onboarding Use Case*: Collecting ID proofs, capturing ID card photograph, office tour.
  - *Software Development / IT Use Case*: Quality analyst test suite (regression, security, performance).
- **Task List Controls & Operations**:
  - `Task List Visibility`: `Internal` (Internal team only) or `External` (Client viewable).
  - `Automated Start Date`: Schedule start dates based on milestone schedules with `Shift Date` date-time picker.
  - `Manage Menu (...)`: `Open Details`, `Open Details in New Tab`, `Copy Link`, `Edit`, `Clone`, `Trash / Delete`, `Move`, `Follow`.
- **Task List Details Drawer (`TaskListDetailsDrawer`)**:
  - Header with progress badge (*40%*), task status counts (*14 Open, 4 Closed*), flag, project, and tags.
  - Cost & Budget Metrics Bar: `PLANNED COST`, `ACTUAL COST`, `BUDGET BALANCE`, `FORECASTED COST`.
  - `Chart View Tab`: Visual SVG pie charts for **Tasks By User**, **Tasks By Status**, **Tasks By Priority**, and **Tasks By Percent Complete**.
  - `Comments Tab`: Add comments with file attachments and live discussion stream.
- **Edit, Clone & Move Modals**:
  - `EditTaskListModal`: Update Task List name, Related Milestone, Flag, and Tags.
  - `CloneTaskListModal`: Replicate task lists from List/Gantt view or Milestone Detail page. Supports dependency options (*Clone current task list* vs *Clone dependent task lists within the project*) and instances replicator count.
  - `MoveTaskListModal`: Relocate Task List to target project and milestone.
- **Milestone Details Drawer (`MilestoneDetailsDrawer`)**:
  - Open from Phases/Milestones list view.
  - Sub-tabs: `Task Lists`, `Issues`, `Release Notes`, `Comments`, `Fields`, `Chart View`, `Status Timeline`, `Activity Stream`.
  - In `Task Lists` tab: `[ Add Task List ]` button, Task Lists data table (`Financing`, `installation`), tag chips, and `Clone` action menu (Screenshot 2).

---

### 10. 📝 Comprehensive Task Creation Suite (`/projects/[id]`)
- **Add Task Modal Form (Screenshot 1)**:
  - Form parameters: `Task Name*`, Rich text description toolbar (*B, I, U, S, font, size, align, list*), `Task List` dropdown, Drag-and-drop file attachment zone (*Max 10 files*), `Task Information` accordion with `Owner` tag pill selection (*👤 Monica Hemsworth ✕*), and orange action buttons (**`[ Add ]`**, **`[ Add More ]`**, **`[ Cancel ]`**).
- **Kanban Quick Task Creation (Screenshot 2)**:
  - Inline `+` button on Kanban column header titled `Create New Tasks`.
  - Inline text area card `|` allowing instant task creation by pressing Enter.
- **Task Templates Setup Screen (Screenshot 3)**:
  - `Setup > Customization > Task Templates`: Pre-built template list (*Concrete work*) with hover **`[ + Add Task ]`** orange button.
- **Email Alias Task Creation (Screenshot 4)**:
  - Task List Details Drawer features **`To add Task via email to this Task list 📋`** link copying `tasklist-coa9@taskpmp.local` to clipboard.

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
│   │   │   ├── reports/      # Reporting data
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
