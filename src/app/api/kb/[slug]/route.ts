import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  const article = await prisma.knowledgeBaseArticle.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, email: true } },
      ticketLinks: {
        include: {
          ticket: { select: { id: true, title: true, status: true } },
        },
      },
    },
  });

  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

  return NextResponse.json({ article });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { title, content, summary, tags, published, helpfulCount } = await req.json();

  const article = await prisma.knowledgeBaseArticle.update({
    where: { slug },
    data: {
      title,
      content,
      summary,
      tags: tags ? tags.map((t: string) => t.toLowerCase()) : undefined,
      published,
      helpfulCount,
    },
  });

  return NextResponse.json({ article });
}
