import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runSLACheck } from "@/lib/sla-engine";

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "ADMIN" && session.role !== "MANAGER") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const result = await runSLACheck();
  return NextResponse.json({ result });
}
