import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, email, password, name, organization } = body;

  if (action === "register") {
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "email, password, and name are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.organizer.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const organizer = await prisma.organizer.create({
      data: { email, passwordHash, name, organization },
    });

    const token = signToken({ organizerId: organizer.id });
    return NextResponse.json({
      token,
      organizer: {
        id: organizer.id,
        name: organizer.name,
        email: organizer.email,
        organization: organizer.organization,
      },
    });
  }

  if (action === "login") {
    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    const organizer = await prisma.organizer.findUnique({ where: { email } });
    if (!organizer) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, organizer.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ organizerId: organizer.id });
    return NextResponse.json({
      token,
      organizer: {
        id: organizer.id,
        name: organizer.name,
        email: organizer.email,
        organization: organizer.organization,
      },
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
