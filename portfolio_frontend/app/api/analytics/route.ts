import { NextResponse } from "next/server";
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

    // Get total views
    const totalViews = portfolio.viewCount;

    // Get views per day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        portfolioId: portfolio.id,
        eventType: "page_view",
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const dailyViews: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const key = date.toISOString().split("T")[0];
      dailyViews[key] = 0;
    }

    for (const event of events) {
      const key = event.createdAt.toISOString().split("T")[0];
      if (dailyViews[key] !== undefined) {
        dailyViews[key]++;
      }
    }

    const chartData = Object.entries(dailyViews).map(([date, views]) => ({
      date,
      views,
    }));

    // Recent activity (last 10 events)
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      totalViews,
      chartData,
      recentEvents,
    }, { status: 200 });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
