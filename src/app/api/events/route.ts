import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = { status: "published" };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { venue: { contains: search } },
    ];
  }

  if (from || to) {
    where.startDate = {};
    if (from) (where.startDate as Record<string, unknown>).gte = new Date(from);
    if (to) (where.startDate as Record<string, unknown>).lte = new Date(to);
  }

  const events = await prisma.event.findMany({
    where,
    include: { organizer: { select: { name: true, organization: true } } },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events);
}
