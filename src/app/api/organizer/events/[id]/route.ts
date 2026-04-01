import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function getOrganizerId(headers: Headers): string | null {
  const token = getTokenFromHeaders(headers);
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.organizerId ?? null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const organizerId = getOrganizerId(request.headers);
  if (!organizerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.organizerId !== organizerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const organizerId = getOrganizerId(request.headers);
  if (!organizerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.organizerId !== organizerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.booking.deleteMany({ where: { eventId: id } });
  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
