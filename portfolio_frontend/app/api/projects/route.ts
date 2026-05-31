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

    const projects = await prisma.project.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects error:", error);
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

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Validate projectUrl if provided
    if (body.projectUrl && typeof body.projectUrl === "string" && body.projectUrl.trim()) {
      try {
        const parsed = new URL(body.projectUrl.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          return NextResponse.json({ error: "Project URL must start with http:// or https://" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid project URL format" }, { status: 400 });
      }
    }

    // Get the current max order to auto-set order
    const maxOrderProject = await prisma.project.findFirst({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (maxOrderProject?.order ?? -1) + 1;

    const project = await prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title: body.title.trim(),
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        projectUrl: body.projectUrl || null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        order: nextOrder,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
