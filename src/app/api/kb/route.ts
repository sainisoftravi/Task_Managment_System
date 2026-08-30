import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const published = searchParams.get("published");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const PAGE_SIZE = 20;

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];
  }
  if (tag) where.tags = { has: tag.toLowerCase() };
  if (published !== null) where.published = published === "true";

  const [articles, total] = await Promise.all([
    prisma.knowledgeBaseArticle.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: { select: { id: true, name: true, email: true } },
        _count: { select: { ticketLinks: true } },
      },
    }),
    prisma.knowledgeBaseArticle.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, summary, tags = [], published = false } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content required" }, { status: 400 });
  }

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const slug = slugify(title) + "-" + Date.now();

  const article = await prisma.knowledgeBaseArticle.create({
    data: {
      title,
      slug,
      content,
      summary,
      tags: tags.map((t: string) => t.toLowerCase()),
      published,
      authorId: session.userId,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}
