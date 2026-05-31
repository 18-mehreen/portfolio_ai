import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    // Fetch existing portfolio or create one if it doesn't exist
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            projects: true,
            skills: true,
            socialLinks: true,
          },
        },
      },
    });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: { userId: user.id },
        include: {
          _count: {
            select: {
              projects: true,
              skills: true,
              socialLinks: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ portfolio }, { status: 200 });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const body = await request.json();

    // Validate that body is an object and not empty
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Request body must contain at least one field to update" },
        { status: 400 }
      );
    }

    // Define allowed fields for update
    const allowedFields = [
      "title",
      "bio",
      "slug",
      "avatarUrl",
      "contactEmail",
      "contactPhone",
      "isPublished",
      "themeId",
      "primaryColor",
      "fontStyle",
      "layoutVariant",
    ];

    // Build update data with only allowed fields that are present
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Validate title
    if ("title" in updateData && updateData.title !== null) {
      const title = String(updateData.title).trim();
      if (title.length === 0) {
        return NextResponse.json({ error: "Title must not be empty" }, { status: 400 });
      }
      if (title.length > 100) {
        return NextResponse.json({ error: "Title must be 100 characters or fewer" }, { status: 400 });
      }
      updateData.title = title;
    }

    // Validate bio length
    if ("bio" in updateData && updateData.bio !== null) {
      const bio = String(updateData.bio);
      if (bio.length > 500) {
        return NextResponse.json({ error: "Bio must be 500 characters or fewer" }, { status: 400 });
      }
    }

    // Validate contactEmail
    if ("contactEmail" in updateData && updateData.contactEmail !== null) {
      const email = String(updateData.contactEmail).trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
      updateData.contactEmail = email || null;
    }

    // Validate slug uniqueness if slug is being updated
    if (updateData.slug) {
      const existingPortfolio = await prisma.portfolio.findFirst({
        where: {
          slug: updateData.slug as string,
          userId: { not: user.id },
        },
      });

      if (existingPortfolio) {
        return NextResponse.json(
          { error: "This slug is already taken" },
          { status: 400 }
        );
      }
    }

    const portfolio = await prisma.portfolio.update({
      where: { userId: user.id },
      data: updateData,
      include: {
        _count: {
          select: {
            projects: true,
            skills: true,
            socialLinks: true,
          },
        },
      },
    });

    return NextResponse.json({ portfolio }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
