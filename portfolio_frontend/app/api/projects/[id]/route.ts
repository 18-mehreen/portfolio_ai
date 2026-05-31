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

    // Verify the project belongs to the user's portfolio
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update data with only allowed fields
    const allowedFields = ["title", "description", "imageUrl", "projectUrl", "tags", "order"];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        if (field === "tags") {
          updateData[field] = Array.isArray(body[field]) ? body[field] : [];
        } else if (field === "title") {
          if (!body[field] || typeof body[field] !== "string" || body[field].trim() === "") {
            return NextResponse.json(
              { error: "Title cannot be empty" },
              { status: 400 }
            );
          }
          updateData[field] = body[field].trim();
        } else if (field === "projectUrl") {
          if (body[field] && typeof body[field] === "string" && body[field].trim()) {
            try {
              const parsed = new URL(body[field].trim());
              if (!["http:", "https:"].includes(parsed.protocol)) {
                return NextResponse.json({ error: "Project URL must start with http:// or https://" }, { status: 400 });
              }
            } catch {
              return NextResponse.json({ error: "Invalid project URL format" }, { status: 400 });
            }
          }
          updateData[field] = body[field];
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

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
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

    // Verify the project belongs to the user's portfolio
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
