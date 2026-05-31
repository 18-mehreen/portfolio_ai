import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const { id } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Verify the skill belongs to the user's portfolio
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    if (existingSkill.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update data with only allowed fields
    const allowedFields = ["name", "level", "category", "order"];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        if (field === "name") {
          if (!body[field] || typeof body[field] !== "string" || body[field].trim() === "") {
            return NextResponse.json(
              { error: "Name cannot be empty" },
              { status: 400 }
            );
          }
          updateData[field] = body[field].trim();
        } else if (field === "level") {
          const level = Number(body[field]);
          if (isNaN(level) || level < 1 || level > 100) {
            return NextResponse.json(
              { error: "Level must be between 1 and 100" },
              { status: 400 }
            );
          }
          updateData[field] = level;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ skill }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/skills/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const { id } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Verify the skill belongs to the user's portfolio
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    if (existingSkill.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/skills/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
