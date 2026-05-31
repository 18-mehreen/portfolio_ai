import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;
    const portfolio = await prisma.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    const education = await prisma.education.findMany({ where: { portfolioId: portfolio.id }, orderBy: { order: "asc" } });
    return NextResponse.json({ education }, { status: 200 });
  } catch (error) {
    console.error("GET /api/education error:", error);
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
    if (!body.degree?.trim()) return NextResponse.json({ error: "Degree is required" }, { status: 400 });
    if (!body.institution?.trim()) return NextResponse.json({ error: "Institution is required" }, { status: 400 });
    const maxOrder = await prisma.education.findFirst({ where: { portfolioId: portfolio.id }, orderBy: { order: "desc" }, select: { order: true } });
    const education = await prisma.education.create({
      data: { portfolioId: portfolio.id, degree: body.degree.trim(), institution: body.institution.trim(), startYear: body.startYear || null, endYear: body.endYear || null, description: body.description || null, order: (maxOrder?.order ?? -1) + 1 },
    });
    return NextResponse.json({ education }, { status: 201 });
  } catch (error) {
    console.error("POST /api/education error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
