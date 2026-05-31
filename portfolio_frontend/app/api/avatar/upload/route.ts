import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be less than 2MB" },
        { status: 400 }
      );
    }

    const avatarUrl = await uploadToCloudinary(file, "avatars");

    await prisma.portfolio.update({
      where: { userId: user.id },
      data: { avatarUrl },
    });

    return NextResponse.json({ avatarUrl }, { status: 201 });
  } catch (error) {
    console.error("POST /api/avatar/upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
