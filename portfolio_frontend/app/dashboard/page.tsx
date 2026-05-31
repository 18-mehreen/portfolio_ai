"use client";

import { useState, useEffect } from "react";
import SlugSettings from "@/app/dashboard/components/SlugSettings";
import AvatarUploader from "@/app/dashboard/components/AvatarUploader";

interface Portfolio {
  id: string;
  title: string | null;
  slug: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPublished: boolean;
  viewCount: number;
  themeId: string | null;
  _count: {
    projects: number;
    skills: number;
    socialLinks: number;
  };
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio");
      if (!res.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      const data = await res.json();
      setPortfolio(data.portfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish() {
    if (!portfolio) return;

    try {
      setToggling(true);
      setError(null);
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !portfolio.isPublished }),
      });

      if (!res.ok) {
        throw new Error("Failed to update publish status");
      }

      const data = await res.json();
      setPortfolio(data.portfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 rounded-lg bg-secondary-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-secondary-200" />
            ))}
          </div>
          <div className="h-40 rounded-lg bg-secondary-200" />
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-error-500 bg-error-50 p-6">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-error-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-error-700">Error loading portfolio</h3>
              <p className="mt-1 text-sm text-error-700">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchPortfolio}
            className="mt-4 rounded-md bg-error-500 px-4 py-2 text-sm font-medium text-white hover:bg-error-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Projects",
      value: portfolio?._count.projects ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Skills",
      value: portfolio?._count.skills ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
    {
      label: "Social Links",
      value: portfolio?._count.socialLinks ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      color: "text-warning-500",
      bg: "bg-warning-50",
    },
    {
      label: "Total Views",
      value: portfolio?.viewCount ?? 0,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "text-success-700",
      bg: "bg-success-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Error banner (non-blocking) */}
      {error && (
        <div className="rounded-lg border border-error-500 bg-error-50 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-error-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-error-700">{error}</p>
          </div>
        </div>
      )}

      {/* Welcome / Status Card */}
      <div className="rounded-lg border border-secondary-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              {portfolio?.title || "My Portfolio"}
            </h2>
            <p className="mt-1 text-sm text-secondary-500">
              Manage your portfolio content and publish it for the world to see.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {portfolio?.slug ? (
              <a
                href={`/portfolio/${portfolio.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View Portfolio
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-secondary-300 px-4 py-2 text-sm font-medium text-secondary-500 cursor-not-allowed">
                Set a slug below to preview
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              portfolio?.isPublished
                ? "bg-success-50 text-success-700"
                : "bg-secondary-100 text-secondary-600"
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                portfolio?.isPublished ? "bg-success-500" : "bg-secondary-400"
              }`} />
              {portfolio?.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-secondary-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-sm text-secondary-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Toggle Card */}
      <div className="rounded-lg border border-secondary-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Portfolio Visibility</h3>
            <p className="mt-1 text-sm text-secondary-500">
              {portfolio?.isPublished
                ? "Your portfolio is live and accessible to visitors."
                : "Your portfolio is in draft mode. Toggle to make it public."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={portfolio?.isPublished ?? false}
            aria-label="Toggle portfolio publish status"
            disabled={toggling}
            onClick={handleTogglePublish}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50 ${
              portfolio?.isPublished ? "bg-success-500" : "bg-secondary-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                portfolio?.isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Portfolio URL when published */}
        {portfolio?.isPublished && portfolio?.slug && (
          <div className="mt-4 rounded-md bg-success-50 p-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-success-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <p className="text-sm font-medium text-success-700">
                Live at:{" "}
                <a
                  href={`/portfolio/${portfolio.slug}`}
                  className="underline hover:text-success-500 transition-colors"
                >
                  /portfolio/{portfolio.slug}
                </a>
              </p>
            </div>
          </div>
        )}

        {portfolio?.isPublished && !portfolio?.slug && (
          <div className="mt-4 rounded-md bg-warning-50 p-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-warning-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-warning-700">
                Set a custom slug below to get a public URL.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <AvatarUploader
        currentAvatarUrl={portfolio?.avatarUrl ?? null}
        onUpdate={(url) => setPortfolio(portfolio ? { ...portfolio, avatarUrl: url } : null)}
      />

      {/* Portfolio URL / Slug Settings */}
      <SlugSettings
        currentSlug={portfolio?.slug ?? null}
        onUpdate={(slug) => setPortfolio(portfolio ? { ...portfolio, slug } : null)}
      />
    </div>
  );
}
