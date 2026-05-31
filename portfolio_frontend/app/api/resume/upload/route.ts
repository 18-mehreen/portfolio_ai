import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const filePath = await uploadToCloudinary(file, "resumes");

    // Delete existing resume if one exists, then create/update
    const existingResume = await prisma.resume.findUnique({
      where: { portfolioId: portfolio.id },
    });

    if (existingResume) {
      await prisma.resume.update({
        where: { portfolioId: portfolio.id },
        data: { fileName: file.name, filePath },
      });
    } else {
      await prisma.resume.create({
        data: { portfolioId: portfolio.id, fileName: file.name, filePath },
      });
    }

    const resume = await prisma.resume.findUnique({
      where: { portfolioId: portfolio.id },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error("POST /api/resume/upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
