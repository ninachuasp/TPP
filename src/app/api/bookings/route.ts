import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { eventId, name, email, tickets = 1 } = body;

  if (!eventId || !name || !email) {
    return NextResponse.json(
      { error: "eventId, name, and email are required" },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.spotsLeft !== null && event.spotsLeft < tickets) {
    return NextResponse.json(
      { error: "Not enough spots available" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.create({
    data: { eventId, name, email, tickets },
  });

  if (event.spotsLeft !== null) {
    await prisma.event.update({
      where: { id: eventId },
      data: { spotsLeft: event.spotsLeft - tickets },
    });
  }

  return NextResponse.json(booking, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400 }
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { email, status: "confirmed" },
    include: {
      event: {
        include: {
          organizer: { select: { name: true, organization: true } },
        },
      },
    },
    orderBy: { event: { startDate: "asc" } },
  });

  return NextResponse.json(bookings);
}
