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

    const certifications = await prisma.certification.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ certifications }, { status: 200 });
  } catch (error) {
    console.error("GET /api/certifications error:", error);
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

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.issuer || typeof body.issuer !== "string" || body.issuer.trim() === "") {
      return NextResponse.json({ error: "Issuer is required" }, { status: 400 });
    }

    // Validate credentialUrl if provided
    if (body.credentialUrl && typeof body.credentialUrl === "string" && body.credentialUrl.trim()) {
      try {
        const parsed = new URL(body.credentialUrl.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          return NextResponse.json({ error: "Credential URL must start with http:// or https://" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid credential URL format" }, { status: 400 });
      }
    }

    const maxOrder = await prisma.certification.findFirst({
      where: { portfolioId: portfolio.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const certification = await prisma.certification.create({
      data: {
        portfolioId: portfolio.id,
        title: body.title.trim(),
        issuer: body.issuer.trim(),
        issueDate: body.issueDate || null,
        credentialUrl: body.credentialUrl || null,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ certification }, { status: 201 });
  } catch (error) {
    console.error("POST /api/certifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
