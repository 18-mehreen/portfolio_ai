import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { deleteFromCloudinary } from "@/lib/cloudinary";

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

    const resume = await prisma.resume.findUnique({
      where: { portfolioId: portfolio.id },
    });

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    console.error("GET /api/resume error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const resume = await prisma.resume.findUnique({
      where: { portfolioId: portfolio.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(resume.filePath);

    await prisma.resume.delete({
      where: { portfolioId: portfolio.id },
    });

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/resume error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
