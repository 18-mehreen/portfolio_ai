import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    select: { id: true, isPublished: true, primaryColor: true, themeId: true, fontStyle: true, user: { select: { name: true } } },
  });

  if (!portfolio || !portfolio.isPublished) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.portfolioId !== portfolio.id) {
    notFound();
  }

  const tags = Array.isArray(project.tags) ? (project.tags as string[]) : [];

  // Theme mapping (same as portfolio page)
  const fontMap: Record<string, string> = {
    inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    poppins: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
    playfair: "var(--font-playfair), ui-serif, Georgia, serif",
  };
  const bgMap: Record<string, { background: string; color: string }> = {
    minimal: { background: "#ffffff", color: "#0f172a" },
    bold: { background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", color: "#f1f5f9" },
    elegant: { background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #0d1b2a 60%, #0a0a1a 100%)", color: "#e2e8f0" },
  };
  const selectedFont = fontMap[portfolio.fontStyle] || fontMap.inter;
  const selectedBg = bgMap[portfolio.themeId] || bgMap.elegant;
  const isLight = portfolio.themeId === "minimal";
  const headingColor = isLight ? "#0f172a" : "#ffffff";
  const subColor = isLight ? "#64748b" : "#94a3b8";
  const textColor = isLight ? "#334155" : "rgba(203, 213, 225, 0.9)";

  return (
    <div
      className="min-h-screen"
      style={{
        background: selectedBg.background,
        color: selectedBg.color,
        fontFamily: selectedFont,
      }}
    >
      {/* Neon glow effects (dark themes only) */}
      {!isLight && (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(139, 92, 246, 0.08)" }} />
        <div className="absolute bottom-1/3 left-0 h-[400px] w-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(6, 182, 212, 0.06)" }} />
      </div>
      )}

      {/* Back navigation */}
      <div className="relative" style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          <Link
            href={`/portfolio/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#94a3b8" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Project Content */}
      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Project Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl font-heading" style={{ color: headingColor }}>
            {project.title}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: portfolio.primaryColor + "20", color: portfolio.primaryColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Project Image */}
        {project.imageUrl && (
          <div className="mb-10 overflow-hidden rounded-xl" style={{ border: "1px solid rgba(148, 163, 184, 0.15)" }}>
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        {/* Description */}
        {project.description && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#f1f5f9" }}>About this project</h2>
            <div
              className="text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: textColor }}
            >
              {project.description}
            </div>
          </div>
        )}

        {/* Project Link */}
        {project.projectUrl && (
          <div className="mb-10">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105"
              style={{
                backgroundColor: portfolio.primaryColor,
                boxShadow: `0 0 20px ${portfolio.primaryColor}40`,
              }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Visit Project
            </a>
          </div>
        )}

        {/* Project Meta */}
        <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
          <p className="text-xs" style={{ color: subColor }}>
            Part of {portfolio.user.name || "this"}&apos;s portfolio
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 text-center" style={{ borderTop: "1px solid rgba(148, 163, 184, 0.1)" }}>
        <p className="text-sm" style={{ color: subColor }}>
          Built with{" "}
          <Link href="/" className="font-semibold" style={{ color: portfolio.primaryColor }}>
            prf
          </Link>
        </p>
      </footer>
    </div>
  );
}
