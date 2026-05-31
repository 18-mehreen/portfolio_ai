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
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const socialLinks = await prisma.socialLink.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ socialLinks }, { status: 200 });
  } catch (error) {
    console.error("GET /api/social-links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const body = await request.json();

    if (!body.platform || typeof body.platform !== "string") {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }

    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation - must start with http:// or https://
    try {
      const parsed = new URL(body.url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format. Must start with http:// or https://" }, { status: 400 });
    }

    const maxOrderLink = await prisma.socialLink.findFirst({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (maxOrderLink?.order ?? -1) + 1;

    const socialLink = await prisma.socialLink.create({
      data: {
        portfolioId: portfolio.id,
        platform: body.platform.trim().toLowerCase(),
        url: body.url.trim(),
        order: nextOrder,
      },
    });

    return NextResponse.json({ socialLink }, { status: 201 });
  } catch (error) {
    console.error("POST /api/social-links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
