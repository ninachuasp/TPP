import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { event: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const event = booking.event;
  const startDt = formatICSDate(event.startDate, event.startTime);
  const endDt = formatICSDate(event.endDate, event.endTime);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SG Arts Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${startDt}`,
    `DTEND:${endDt}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.venue}, ${event.address}`,
    `UID:${booking.id}@sg-arts-events`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics"`,
    },
  });
}

function formatICSDate(date: Date, time: string): string {
  const d = new Date(date);
  const [hours, minutes] = time.split(":");
  d.setHours(parseInt(hours), parseInt(minutes), 0);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
