import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function getOrganizerId(headers: Headers): string | null {
  const token = getTokenFromHeaders(headers);
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.organizerId ?? null;
}

export async function GET(request: NextRequest) {
  const organizerId = getOrganizerId(request.headers);
  if (!organizerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { organizerId },
    include: { _count: { select: { bookings: true } } },
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const organizerId = getOrganizerId(request.headers);
  if (!organizerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title, description, category, venue, address, imageUrl,
    startDate, endDate, startTime, endTime,
    price = 0, isFree = true, capacity,
  } = body;

  if (!title || !description || !category || !venue || !address || !startDate || !endDate || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category,
      venue,
      address,
      imageUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      price,
      isFree,
      capacity,
      spotsLeft: capacity,
      organizerId,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
