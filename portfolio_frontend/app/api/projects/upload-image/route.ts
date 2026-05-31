import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be less than 5MB" }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(file, "projects");

    return NextResponse.json({ imageUrl }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/upload-image error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
