import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const role = body.role || "";

    // Fetch user's portfolio with skills and projects for context
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: {
        skills: { orderBy: { order: "asc" }, select: { name: true, level: true } },
        projects: { orderBy: { order: "asc" }, select: { title: true, description: true } },
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Build context for the prompt
    const skillsList = portfolio.skills.map((s) => s.name).join(", ");
    const projectsList = portfolio.projects
      .map((p) => p.title)
      .join(", ");

    const roleContext = role ? `Their role/title is: ${role}.` : "";
    const skillsContext = skillsList ? `Their key skills include: ${skillsList}.` : "";
    const projectsContext = projectsList ? `They have worked on projects such as: ${projectsList}.` : "";

    const prompt = `Write a professional portfolio bio (2-3 sentences) for a developer/professional. ${roleContext} ${skillsContext} ${projectsContext} The bio should be concise, confident, and written in first person. Do not use quotation marks around the response.`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional copywriter who writes concise, engaging portfolio bios for developers and professionals.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const bio = completion.choices[0]?.message?.content?.trim() || "";

    if (!bio) {
      return NextResponse.json(
        { error: "Failed to generate bio. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ bio }, { status: 200 });
  } catch (error) {
    console.error("POST /api/bio/generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate bio. Please try again." },
      { status: 500 }
    );
  }
}
