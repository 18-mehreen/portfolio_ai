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

    const portfolio = await prisma.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

    const existing = await prisma.certification.findUnique({ where: { id } });
    if (!existing || existing.portfolioId !== portfolio.id) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = ["title", "issuer", "issueDate", "credentialUrl", "order"];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body && body[field] !== undefined) {
        updateData[field] = body[field] === "" ? null : body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ certification }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/certifications/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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

    const portfolio = await prisma.portfolio.findUnique({ where: { userId: user.id } });
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

    const existing = await prisma.certification.findUnique({ where: { id } });
    if (!existing || existing.portfolioId !== portfolio.id) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ message: "Certification deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/certifications/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
