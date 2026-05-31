"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  views: number;
}

interface AnalyticsEvent {
  id: string;
  eventType: string;
  createdAt: string;
}

export default function AnalyticsPage() {
  const [totalViews, setTotalViews] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setTotalViews(data.totalViews ?? 0);
        setChartData(data.chartData ?? []);
        setRecentEvents(data.recentEvents ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-1/4 rounded bg-secondary-200" />
          <div className="h-24 rounded-lg bg-secondary-100" />
          <div className="h-64 rounded-lg bg-secondary-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-error-500 bg-error-50 p-4 text-sm text-error-700">
          {error}
        </div>
      </div>
    );
  }

  const viewsThisWeek = chartData.slice(-7).reduce((sum, d) => sum + d.views, 0);
  const viewsToday = chartData.length > 0 ? chartData[chartData.length - 1].views : 0;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-secondary-900">Visitor Analytics</h2>
        <p className="mt-1 text-sm text-secondary-500">Track who views your portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-secondary-200 bg-white p-5">
          <p className="text-sm text-secondary-500">Total Views</p>
          <p className="mt-1 text-3xl font-bold text-secondary-900">{totalViews}</p>
        </div>
        <div className="rounded-lg border border-secondary-200 bg-white p-5">
          <p className="text-sm text-secondary-500">This Week</p>
          <p className="mt-1 text-3xl font-bold text-secondary-900">{viewsThisWeek}</p>
        </div>
        <div className="rounded-lg border border-secondary-200 bg-white p-5">
          <p className="text-sm text-secondary-500">Today</p>
          <p className="mt-1 text-3xl font-bold text-secondary-900">{viewsToday}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-secondary-200 bg-white p-6">
        <h3 className="text-sm font-medium text-secondary-700 mb-4">Views (Last 30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(value) => {
                  const d = new Date(value);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      {recentEvents.length > 0 && (
        <div className="rounded-lg border border-secondary-200 bg-white p-6">
          <h3 className="text-sm font-medium text-secondary-700 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                <span className="text-sm text-secondary-700 capitalize">
                  {event.eventType.replace("_", " ")}
                </span>
                <span className="text-xs text-secondary-500">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
