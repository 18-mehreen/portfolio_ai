import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate name if provided
    if (name !== undefined && name !== null) {
      const trimmedName = String(name).trim();
      if (trimmedName.length === 0) {
        return NextResponse.json(
          { error: "Name must not be empty if provided" },
          { status: 400 }
        );
      }
      if (trimmedName.length > 100) {
        return NextResponse.json(
          { error: "Name must be 100 characters or fewer" },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and portfolio in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        portfolio: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
