import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      select: { themeId: true, primaryColor: true, fontStyle: true, layoutVariant: true },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({ theme: portfolio }, { status: 200 });
  } catch (error) {
    console.error("GET /api/theme error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const body = await request.json();
    const allowedFields = ["themeId", "primaryColor", "fontStyle", "layoutVariant"];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.update({
      where: { userId: user.id },
      data: updateData,
      select: { themeId: true, primaryColor: true, fontStyle: true, layoutVariant: true },
    });

    return NextResponse.json({ theme: portfolio }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/theme error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
