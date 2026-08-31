import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding enterprise database with PoC project entries...");

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
  const devTeam = await prisma.team.create({
    data: { name: "Development Team", slug: "dev" },
  });
  const supportTeam = await prisma.team.create({
    data: { name: "Support Team", slug: "support" },
  });

  // Create Users matching enterprise roster
  const admin = await prisma.user.create({
    data: {
      email: "admin@taskpmp.local",
      name: "Ravi Saini",
      password: await hash("admin123", 10),
      role: "ADMIN",
      teamId: devTeam.id,
    },
  });

  const aminUser = await prisma.user.create({
    data: {
      email: "amin@taskpmp.local",
      name: "amin ibrahim",
      password: await hash("amin123", 10),
      role: "DEVELOPER",
      teamId: devTeam.id,
    },
  });

  const kannadasUser = await prisma.user.create({
    data: {
      email: "kannadas@taskpmp.local",
      name: "kannadas A",
      password: await hash("kannadas123", 10),
      role: "DEVELOPER",
      teamId: devTeam.id,
    },
  });

  const sushilUser = await prisma.user.create({
    data: {
      email: "sushil@taskpmp.local",
      name: "Sushil Verma",
      password: await hash("sushil123", 10),
      role: "MANAGER",
      teamId: devTeam.id,
    },
  });

  // Create Main Enterprise Project: 01 PoC Projects
  const pocProject = await prisma.project.create({
    data: {
      name: "01 PoC Projects",
      key: "1P1",
      description: "Enterprise PoC Digital Twin & Master Engineering Projects",
      status: "ACTIVE",
      startDate: new Date("2025-12-01"),
      dueDate: new Date("2026-12-31"),
      ownerId: sushilUser.id,
      teamId: devTeam.id,
      members: {
        create: [
          { userId: admin.id, role: "MEMBER" },
          { userId: aminUser.id, role: "MEMBER" },
          { userId: kannadasUser.id, role: "MEMBER" },
          { userId: sushilUser.id, role: "OWNER" },
        ],
      },
    },
  });

  // Create Milestones & Task Lists
  const milestone1 = await prisma.milestone.create({
    data: {
      projectId: pocProject.id,
      name: "Phase 1: Implementation & Digital Twin Support",
      description: "Site setup and load test implementation phase",
      dueDate: new Date("2026-06-30"),
    },
  });

  const taskList1 = await prisma.taskList.create({
    data: {
      projectId: pocProject.id,
      milestoneId: milestone1.id,
      name: "General Engineering & Load Testing",
      sortOrder: 0,
    },
  });

  // Create Tasks matching user's exact spreadsheet data
  const t1 = await prisma.task.create({
    data: {
      projectId: pocProject.id,
      taskListId: taskList1.id,
      title: "01 Jindal site incharge - Arun primary - Senthil secondary",
      description: "Site incharge coordination and primary/secondary resource assignment",
      status: "TODO",
      priority: "MEDIUM",
      assigneeId: null,
      estimatedHours: 2,
      startDate: new Date("2025-12-20T09:00:00"),
      dueDate: new Date("2025-12-20T11:00:00"),
    },
  });

  const t2 = await prisma.task.create({
    data: {
      projectId: pocProject.id,
      taskListId: taskList1.id,
      title: "02 Project Master Excel",
      description: "Master project breakdown excel structure and tracking metrics",
      status: "TODO",
      priority: "LOW",
      assigneeId: admin.id,
      estimatedHours: 16,
      startDate: new Date("2025-12-22T19:00:00"),
      dueDate: new Date("2025-12-23T11:00:00"),
    },
  });

  const t3 = await prisma.task.create({
    data: {
      projectId: pocProject.id,
      taskListId: taskList1.id,
      title: "01 Digital Twin Support at Client Side",
      description: "On-site digital twin implementation and client deployment support",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      assigneeId: aminUser.id,
      estimatedHours: 41,
      startDate: new Date("2026-01-18T10:00:00"),
      dueDate: new Date("2026-01-22T19:00:00"),
    },
  });

  const t4 = await prisma.task.create({
    data: {
      projectId: pocProject.id,
      taskListId: taskList1.id,
      title: "Concurrent User Load Test for Performance",
      description: "Run concurrent user performance load testing across digital twin endpoints",
      status: "IN_REVIEW",
      priority: "HIGH",
      assigneeId: kannadasUser.id,
      estimatedHours: 2,
      startDate: new Date("2026-02-01T09:00:00"),
      dueDate: new Date("2026-02-01T11:00:00"),
    },
  });

  const t5 = await prisma.task.create({
    data: {
      projectId: pocProject.id,
      taskListId: taskList1.id,
      title: "02 JWIL Chennai - 2 parts - post at 2 locations",
      description: "JWIL Chennai deployment - Part 1 and Part 2 posted across dual locations",
      status: "IN_REVIEW",
      priority: "MEDIUM",
      assigneeId: null,
      estimatedHours: 1,
      startDate: new Date("2026-02-05T10:00:00"),
      dueDate: new Date("2026-02-05T11:00:00"),
    },
  });

  // Create initial activities
  await prisma.activity.createMany({
    data: [
      { userId: sushilUser.id, action: "project.created", entityType: "Project", entityId: pocProject.id, details: JSON.stringify({ name: "01 PoC Projects" }), projectId: pocProject.id },
      { userId: sushilUser.id, action: "task.created", entityType: "Task", entityId: t2.id, details: JSON.stringify({ title: "02 Project Master Excel" }), taskId: t2.id, projectId: pocProject.id },
      { userId: aminUser.id, action: "task.updated", entityType: "Task", entityId: t3.id, details: JSON.stringify({ status: "in QA" }), taskId: t3.id, projectId: pocProject.id },
    ],
  });

  console.log("✅ Database seeded with 01 PoC Projects & Tasks!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
