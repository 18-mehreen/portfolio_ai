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
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const existingLink = await prisma.socialLink.findUnique({ where: { id } });

    if (!existingLink || existingLink.portfolioId !== portfolio.id) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = ["platform", "url", "order"];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        if (field === "url") {
          try {
            const parsed = new URL(body.url);
            if (!["http:", "https:"].includes(parsed.protocol)) {
              return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
            }
          } catch {
            return NextResponse.json({ error: "Invalid URL format. Must start with http:// or https://" }, { status: 400 });
          }
          updateData[field] = body[field].trim();
        } else if (field === "platform") {
          updateData[field] = body[field].trim().toLowerCase();
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ socialLink }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/social-links/[id] error:", error);
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

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const existingLink = await prisma.socialLink.findUnique({ where: { id } });

    if (!existingLink || existingLink.portfolioId !== portfolio.id) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 });
    }

    await prisma.socialLink.delete({ where: { id } });

    return NextResponse.json({ message: "Social link deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/social-links/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
