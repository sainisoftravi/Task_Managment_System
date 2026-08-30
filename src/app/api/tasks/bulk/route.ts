import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { taskIds, action, payload } = body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json({ error: "taskIds array is required" }, { status: 400 });
    }

    if (action === "UPDATE_STATUS" && payload?.status) {
      await prisma.task.updateMany({
        where: { id: { in: taskIds } },
        data: { status: payload.status },
      });
      return NextResponse.json({ success: true, count: taskIds.length });
    }

    if (action === "UPDATE_PRIORITY" && payload?.priority) {
      await prisma.task.updateMany({
        where: { id: { in: taskIds } },
        data: { priority: payload.priority },
      });
      return NextResponse.json({ success: true, count: taskIds.length });
    }

    if (action === "ASSIGN_AGENT") {
      await prisma.task.updateMany({
        where: { id: { in: taskIds } },
        data: { assigneeId: payload?.assigneeId || null },
      });
      return NextResponse.json({ success: true, count: taskIds.length });
    }

    if (action === "DELETE") {
      await prisma.$transaction([
        prisma.timeLog.deleteMany({ where: { taskId: { in: taskIds } } }),
        prisma.taskDependency.deleteMany({
          where: { OR: [{ taskId: { in: taskIds } }, { dependsOnTaskId: { in: taskIds } }] },
        }),
        prisma.task.deleteMany({ where: { id: { in: taskIds } } }),
      ]);
      return NextResponse.json({ success: true, count: taskIds.length });
    }

    return NextResponse.json({ error: "Invalid action or payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Bulk operation failed" }, { status: 500 });
  }
}
