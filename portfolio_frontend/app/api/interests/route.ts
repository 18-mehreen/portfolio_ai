import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;
    const portfolio = await prisma.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    const interests = await prisma.interest.findMany({ where: { portfolioId: portfolio.id }, orderBy: { order: "asc" } });
    return NextResponse.json({ interests }, { status: 200 });
  } catch (error) {
    console.error("GET /api/interests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;
    const portfolio = await prisma.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    const body = await request.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const maxOrder = await prisma.interest.findFirst({ where: { portfolioId: portfolio.id }, orderBy: { order: "desc" }, select: { order: true } });
    const interest = await prisma.interest.create({
      data: { portfolioId: portfolio.id, name: body.name.trim(), description: body.description || null, order: (maxOrder?.order ?? -1) + 1 },
    });
    return NextResponse.json({ interest }, { status: 201 });
  } catch (error) {
    console.error("POST /api/interests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
