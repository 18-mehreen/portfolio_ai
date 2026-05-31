import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const skills = await prisma.skill.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ skills }, { status: 200 });
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Validate level if provided
    let level = 50;
    if (body.level !== undefined) {
      level = Number(body.level);
      if (isNaN(level) || level < 1 || level > 100) {
        return NextResponse.json(
          { error: "Level must be between 1 and 100" },
          { status: 400 }
        );
      }
    }

    // Get the current max order to auto-set order
    const maxOrderSkill = await prisma.skill.findFirst({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (maxOrderSkill?.order ?? -1) + 1;

    const skill = await prisma.skill.create({
      data: {
        portfolioId: portfolio.id,
        name: body.name.trim(),
        level,
        category: body.category || null,
        order: nextOrder,
      },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error("POST /api/skills error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
