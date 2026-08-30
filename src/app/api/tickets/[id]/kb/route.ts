import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { wsServer } from "@/lib/websocket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { teamId: true },
  });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const links = await prisma.ticketKbArticle.findMany({
    where: { ticketId: id },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          published: true,
          tags: true,
          helpfulCount: true,
        },
      },
    },
  });

  return NextResponse.json({ articles: links.map((l) => l.article) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { articleId } = await req.json();

  if (!articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { teamId: true },
  });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const article = await prisma.knowledgeBaseArticle.findUnique({
    where: { id: articleId },
  });
  if (!article) return NextResponse.json({ error: "KB article not found" }, { status: 404 });

  try {
    await prisma.ticketKbArticle.create({
      data: {
        ticketId: id,
        articleId,
      },
    });
  } catch {
    return NextResponse.json({ error: "Article already linked to ticket" }, { status: 409 });
  }

  wsServer.broadcastToTeam(ticket.teamId ?? "", {
    type: "ticket:kb:linked",
    payload: { ticketId: id, articleId },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  await prisma.ticketKbArticle.deleteMany({
    where: { ticketId: id, articleId },
  });

  return NextResponse.json({ success: true });
}
