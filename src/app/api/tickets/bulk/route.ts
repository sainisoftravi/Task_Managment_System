import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { ticketIds, action, payload } = body;

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json({ error: "ticketIds array is required" }, { status: 400 });
    }

    if (action === "UPDATE_STATUS" && payload?.status) {
      const isResolved = payload.status === "RESOLVED" || payload.status === "CLOSED";
      await prisma.ticket.updateMany({
        where: { id: { in: ticketIds } },
        data: {
          status: payload.status,
          ...(isResolved ? { resolvedAt: new Date() } : {}),
        },
      });
      return NextResponse.json({ success: true, count: ticketIds.length });
    }

    if (action === "UPDATE_PRIORITY" && payload?.priority) {
      await prisma.ticket.updateMany({
        where: { id: { in: ticketIds } },
        data: { priority: payload.priority },
      });
      return NextResponse.json({ success: true, count: ticketIds.length });
    }

    if (action === "ASSIGN_AGENT") {
      await prisma.ticket.updateMany({
        where: { id: { in: ticketIds } },
        data: { assigneeId: payload?.assigneeId || null },
      });
      return NextResponse.json({ success: true, count: ticketIds.length });
    }

    if (action === "DELETE") {
      await prisma.$transaction([
        prisma.ticketComment.deleteMany({ where: { ticketId: { in: ticketIds } } }),
        prisma.ticketKbArticle.deleteMany({ where: { ticketId: { in: ticketIds } } }),
        prisma.timeLog.deleteMany({ where: { ticketId: { in: ticketIds } } }),
        prisma.ticket.deleteMany({ where: { id: { in: ticketIds } } }),
      ]);
      return NextResponse.json({ success: true, count: ticketIds.length });
    }

    return NextResponse.json({ error: "Invalid action or payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Bulk operation failed" }, { status: 500 });
  }
}
