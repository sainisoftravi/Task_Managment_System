import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.notification.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.timeLog.deleteMany({});
  await prisma.taskDependency.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.taskList.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.ticketKbArticle.deleteMany({});
  await prisma.knowledgeBaseArticle.deleteMany({});
  await prisma.ticketComment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.slaEscalation.deleteMany({});
  await prisma.slaPolicy.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});

  // Create Teams
  const supportTeam = await prisma.team.create({
    data: { name: "Support Team", slug: "support" },
  });
  const devTeam = await prisma.team.create({
    data: { name: "Development Team", slug: "dev" },
  });

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@taskpmp.local",
      name: "Admin User",
      password: await hash("admin123", 10),
      role: "ADMIN",
      teamId: supportTeam.id,
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: "agent@taskpmp.local",
      name: "Support Agent",
      password: await hash("agent123", 10),
      role: "AGENT",
      teamId: supportTeam.id,
    },
  });

  const developer = await prisma.user.create({
    data: {
      email: "dev@taskpmp.local",
      name: "Dev Engineer",
      password: await hash("dev123", 10),
      role: "DEVELOPER",
      teamId: devTeam.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@taskpmp.local",
      name: "Project Manager",
      password: await hash("manager123", 10),
      role: "MANAGER",
      teamId: devTeam.id,
    },
  });

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: "Acme Corp",
      email: "contact@acme.com",
      company: "Acme Corporation",
      phone: "+1-555-0100",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Globex Inc",
      email: "support@globex.com",
      company: "Globex Industries",
      phone: "+1-555-0200",
    },
  });

  // Create SLA Policies
  const urgentSla = await prisma.slaPolicy.create({
    data: {
      name: "Urgent Response",
      priority: "URGENT",
      responseTimeMinutes: 30,
      resolutionTimeMinutes: 120,
      active: true,
      ownerId: admin.id,
      escalations: {
        create: [
          { afterMinutes: 15, action: "NOTIFY" },
          { afterMinutes: 60, action: "REASSIGN" },
        ],
      },
    },
  });

  const highSla = await prisma.slaPolicy.create({
    data: {
      name: "High Priority",
      priority: "HIGH",
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 240,
      active: true,
      ownerId: admin.id,
      escalations: {
        create: [
          { afterMinutes: 30, action: "NOTIFY" },
          { afterMinutes: 120, action: "REASSIGN" },
        ],
      },
    },
  });

  const mediumSla = await prisma.slaPolicy.create({
    data: {
      name: "Standard Response",
      priority: "MEDIUM",
      responseTimeMinutes: 120,
      resolutionTimeMinutes: 480,
      active: true,
      ownerId: admin.id,
      escalations: {
        create: [{ afterMinutes: 60, action: "NOTIFY" }],
      },
    },
  });

  // Create Knowledge Base Articles
  const kb1 = await prisma.knowledgeBaseArticle.create({
    data: {
      title: "Resetting Your Password",
      slug: "resetting-your-password",
      content: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link.",
      summary: "Instructions for resetting your account password.",
      authorId: admin.id,
      published: true,
      tags: JSON.stringify(["account", "password", "reset"]),
    },
  });

  const kb2 = await prisma.knowledgeBaseArticle.create({
    data: {
      title: "Creating a Support Ticket",
      slug: "creating-a-support-ticket",
      content: "You can create a support ticket from the web portal, email, or API. Include as much detail as possible for faster resolution.",
      summary: "Learn how to create and submit support tickets effectively.",
      authorId: agent.id,
      published: true,
      tags: JSON.stringify(["tickets", "support", "getting-started"]),
    },
  });

  const kb3 = await prisma.knowledgeBaseArticle.create({
    data: {
      title: "Understanding SLA Levels",
      slug: "understanding-sla-levels",
      content: "SLA levels define response times based on priority: Urgent (30 min), High (1 hr), Medium (2 hrs), Low (4 hrs).",
      summary: "Overview of SLA priority levels and expected response times.",
      authorId: manager.id,
      published: true,
      tags: JSON.stringify(["sla", "support", "policies"]),
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      key: "WR-123",
      description: "Complete redesign of the company website with modern UI/UX",
      status: "ACTIVE",
      startDate: new Date("2024-01-15"),
      dueDate: new Date("2024-06-30"),
      ownerId: manager.id,
      teamId: devTeam.id,
      members: {
        create: [
          { userId: manager.id, role: "OWNER" },
          { userId: developer.id, role: "MEMBER" },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Development",
      key: "APP-456",
      description: "Native mobile application for iOS and Android",
      status: "ACTIVE",
      startDate: new Date("2024-03-01"),
      dueDate: new Date("2024-09-15"),
      ownerId: manager.id,
      teamId: devTeam.id,
      members: {
        create: [
          { userId: manager.id, role: "OWNER" },
          { userId: developer.id, role: "MEMBER" },
        ],
      },
    },
  });

  // Create Milestones
  const milestone1 = await prisma.milestone.create({
    data: {
      projectId: project1.id,
      name: "Phase 1: Design",
      description: "UI/UX design and prototyping",
      dueDate: new Date("2024-03-31"),
    },
  });

  const milestone2 = await prisma.milestone.create({
    data: {
      projectId: project1.id,
      name: "Phase 2: Development",
      description: "Frontend and backend development",
      dueDate: new Date("2024-05-31"),
    },
  });

  // Create Task Lists
  const backlogList = await prisma.taskList.create({
    data: {
      projectId: project1.id,
      milestoneId: milestone2.id,
      name: "Backlog",
      sortOrder: 0,
    },
  });

  const inProgressList = await prisma.taskList.create({
    data: {
      projectId: project1.id,
      milestoneId: milestone2.id,
      name: "In Progress",
      sortOrder: 1,
    },
  });

  const doneList = await prisma.taskList.create({
    data: {
      projectId: project1.id,
      milestoneId: milestone2.id,
      name: "Done",
      sortOrder: 2,
    },
  });

  // Create Tasks with dependencies
  const task1 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: "Design system components",
      description: "Create a design system with reusable components",
      status: "DONE",
      priority: "HIGH",
      assigneeId: developer.id,
      taskListId: doneList.id,
      estimatedHours: 16,
      loggedHours: 16,
      dueDate: new Date("2024-03-15"),
      startDate: new Date("2024-03-01"),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: "Implement homepage layout",
      description: "Build the responsive homepage with hero section",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assigneeId: developer.id,
      taskListId: inProgressList.id,
      estimatedHours: 24,
      loggedHours: 12,
      dueDate: new Date("2024-04-15"),
      startDate: new Date("2024-04-01"),
    },
  });

  const task3 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment",
      status: "TODO",
      priority: "MEDIUM",
      assigneeId: developer.id,
      taskListId: backlogList.id,
      estimatedHours: 8,
      dueDate: new Date("2024-05-15"),
    },
  });

  const task4 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: "API endpoints for user auth",
      description: "Create REST API endpoints for authentication and user management",
      status: "TODO",
      priority: "HIGH",
      assigneeId: developer.id,
      taskListId: backlogList.id,
      estimatedHours: 12,
      dueDate: new Date("2024-05-20"),
    },
  });

  // Dependencies: task2 depends on task1 (already done), task4 depends on task2
  await prisma.taskDependency.createMany({
    data: [
      { taskId: task2.id, dependsOnTaskId: task1.id, type: "FINISH_TO_START" },
      { taskId: task4.id, dependsOnTaskId: task2.id, type: "FINISH_TO_START" },
    ],
  });

  // Create Tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: "Cannot login to admin panel",
      description: "I'm unable to log in to the admin panel. I get an 'Invalid credentials' error even though I'm using the correct password.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      category: "Technical",
      source: "WEB",
      customerId: customer1.id,
      assigneeId: agent.id,
      teamId: supportTeam.id,
      projectId: project1.id,
      slaDueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      slaBreached: false,
      authorId: agent.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "Billing discrepancy on invoice #12345",
      description: "The invoice shows a charge I don't recognize. Please investigate.",
      priority: "MEDIUM",
      status: "OPEN",
      category: "Billing",
      source: "EMAIL",
      customerId: customer2.id,
      assigneeId: agent.id,
      teamId: supportTeam.id,
      slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      slaBreached: false,
      authorId: agent.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: "Urgent: API returning 500 errors",
      description: "The production API has been returning 500 Internal Server Error for the past hour. This is affecting all users.",
      priority: "URGENT",
      status: "OPEN",
      category: "Technical",
      source: "API",
      customerId: customer1.id,
      assigneeId: agent.id,
      teamId: supportTeam.id,
      projectId: project2.id,
      slaDueAt: new Date(Date.now() + 30 * 60 * 1000),
      slaBreached: false,
      authorId: agent.id,
    },
  });

  // Create Comments
  await prisma.ticketComment.createMany({
    data: [
      {
        ticketId: ticket1.id,
        authorId: agent.id,
        content: "[Customer] I've tried resetting my password but it still doesn't work.",
        type: "PUBLIC",
      },
      {
        ticketId: ticket1.id,
        authorId: agent.id,
        content: "I see the issue in the logs. The user's account is locked due to too many failed attempts. I'm unlocking it now.",
        type: "PRIVATE",
      },
    ],
  });

  // Link KB articles to tickets
  await prisma.ticketKbArticle.createMany({
    data: [
      { ticketId: ticket1.id, articleId: kb1.id },
      { ticketId: ticket2.id, articleId: kb3.id },
    ],
  });

  // Create Time Logs
  await prisma.timeLog.createMany({
    data: [
      {
        userId: developer.id,
        taskId: task1.id,
        durationMinutes: 480,
        billableType: "BILLABLE",
        description: "Completed design system",
        logDate: new Date("2024-03-14"),
      },
      {
        userId: developer.id,
        taskId: task2.id,
        durationMinutes: 360,
        billableType: "BILLABLE",
        description: "Homepage layout implementation",
        logDate: new Date("2024-04-03"),
      },
      {
        userId: agent.id,
        ticketId: ticket1.id,
        durationMinutes: 120,
        billableType: "BILLABLE",
        description: "Investigated login issue",
        logDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: agent.id,
        ticketId: ticket2.id,
        durationMinutes: 60,
        billableType: "BILLABLE",
        description: "Initial investigation",
        logDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // Create Activities
  await prisma.activity.createMany({
    data: [
       { userId: admin.id, action: "project.created", entityType: "Project", entityId: project1.id, details: JSON.stringify({ name: "Website Redesign" }), projectId: project1.id },
      { userId: manager.id, action: "task.created", entityType: "Task", entityId: task1.id, details: JSON.stringify({ title: "Design system components" }), taskId: task1.id, projectId: project1.id },
      { userId: agent.id, action: "ticket.assigned", entityType: "Ticket", entityId: ticket1.id, details: JSON.stringify({ assignee: "agent" }), ticketId: ticket1.id },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`  - ${admin.name}, ${agent.name}, ${developer.name}, ${manager.name} users`);
  console.log(`  - ${customer1.name}, ${customer2.name} customers`);
  console.log("  - 3 SLA policies");
  console.log("  - 3 KB articles");
  console.log("  - 2 projects, 4 tasks, 3 tickets");
  console.log("  - 2 task dependencies");
  console.log("  - 2 ticket comments, 2 KB linkages");
  console.log("  - 4 time logs");
  console.log("  - 3 activities");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
