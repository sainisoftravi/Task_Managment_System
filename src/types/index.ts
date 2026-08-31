import { JwtPayload } from "jsonwebtoken";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  teamId?: string | null;
  avatar?: string | null;
}

export type UserRole = "ADMIN" | "AGENT" | "MANAGER" | "CUSTOMER" | "DEVELOPER";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "RESOLVED" | "CLOSED";
export type TicketSource = "WEB" | "EMAIL" | "PORTAL" | "API" | "PHONE";
export type CommentType = "PUBLIC" | "PRIVATE";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type ProjectRole = "OWNER" | "MANAGER" | "MEMBER";
export type BillableType = "BILLABLE" | "NON_BILLABLE";
export type DependencyType = "FINISH_TO_START" | "START_TO_START" | "FINISH_TO_FINISH" | "START_TO_FINISH";
export type SLAEscalationAction = "REASSIGN" | "NOTIFY" | "ESCALATE";
export type NotificationType =
  | "TICKET_ASSIGNED"
  | "TICKET_UPDATED"
  | "SLA_BREACH"
  | "SLA_WARNING"
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_DEPENDENCY"
  | "COMMENT_MENTION"
  | "TIME_LOG_APPROVAL"
  | "PROJECT_UPDATE";

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
  avatar?: string | null;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category?: string | null;
  source: TicketSource;
  slaBreached: boolean;
  slaDueAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  customerId?: string | null;
  customer?: Customer | null;
  assigneeId?: string | null;
  assignee?: User | null;
  authorId: string;
  author?: User | null;
  teamId?: string | null;
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
  convertedTaskId?: string | null;
  team?: Team;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  author?: User | null;
  content: string;
  type: CommentType;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  authorId: string;
  published: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface SLAPolicy {
  id: string;
  name: string;
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  active: boolean;
  ownerId?: string | null;
  createdAt: string;
  updatedAt: string;
  escalations: SLAEscalation[];
}

export interface SLAEscalation {
  id: string;
  slaPolicyId: string;
  afterMinutes: number;
  action: SLAEscalationAction;
  targetRoleId?: string | null;
  targetTeamId?: string | null;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  status: ProjectStatus;
  startDate: string;
  dueDate?: string | null;
  ownerId?: string | null;
  owner?: User | null;
  teamId?: string | null;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  taskLists: TaskList[];
}

export interface TaskList {
  id: string;
  projectId: string;
  milestoneId?: string | null;
  name: string;
  sortOrder: number;
  createdAt: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  key?: string;
  projectId: string;
  project?: Project | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  assignee?: User | null;
  taskListId: string;
  taskList?: TaskList;
  parentTaskId?: string | null;
  estimatedHours?: number | null;
  loggedHours?: number | null;
  dueDate?: string | null;
  startDate?: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: Task[];
  dependencies: TaskDependency[];
  dependents: TaskDependency[];
  convertedFromTicketId?: string | null;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  task?: Task;
  dependsOnTaskId: string;
  dependsOn?: Task;
  type: DependencyType;
  createdAt: string;
}

export interface TimeLog {
  id: string;
  userId: string;
  user?: User | null;
  taskId?: string | null;
  task?: Task | null;
  ticketId?: string | null;
  ticket?: Ticket | null;
  projectId?: string | null;
  project?: Project | null;
  durationMinutes: number;
  billableType: BillableType;
  description?: string | null;
  logDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  entityId?: string | null;
  entityType?: string | null;
  createdAt: string;
}

export interface AuthPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface WebSocketEvent {
  type: string;
  payload: unknown;
  userId?: string;
  teamId?: string;
}

export interface DashboardSLAData {
  priority: TicketPriority;
  count: number;
  breached: number;
  warning: number;
  ok: number;
}

export interface DashboardOverdueTask {
  id: string;
  title: string;
  dueDate: string;
  projectName: string;
  assigneeName?: string | null;
}

export interface DashboardResourceHours {
  userId: string;
  userName: string;
  billableHours: number;
  nonBillableHours: number;
  totalHours: number;
}
