import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    select: { title: true, bio: true, primaryColor: true, user: { select: { name: true } } },
  });

  if (!portfolio) {
    return { title: "Portfolio Not Found" };
  }

  const displayName = portfolio.user.name || portfolio.title || "Portfolio";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = portfolio.primaryColor || "#6366f1";

  // Create SVG favicon with initials
  const svgFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="${encodeURIComponent(color)}"/><text x="50" y="50" font-size="40" font-family="Arial,sans-serif" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;

  return {
    title: `${displayName} | Portfolio`,
    description: portfolio.bio?.slice(0, 160) || `${displayName}'s professional portfolio`,
    icons: {
      icon: svgFavicon,
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      user: { select: { name: true, email: true } },
      projects: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
      certifications: { orderBy: { order: "asc" } },
      education: { orderBy: { order: "asc" } },
      interests: { orderBy: { order: "asc" } },
      resume: true,
    },
  });

  if (!portfolio || !portfolio.isPublished) {
    notFound();
  }

  // Track page view
  await prisma.analyticsEvent.create({
    data: {
      portfolioId: portfolio.id,
      eventType: "page_view",
    },
  });

  // Increment view count
  await prisma.portfolio.update({
    where: { id: portfolio.id },
    data: { viewCount: { increment: 1 } },
  });

  const displayName = portfolio.user.name || portfolio.title || "Portfolio";

  // Font mapping
  const fontMap: Record<string, string> = {
    inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    poppins: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
    playfair: "var(--font-playfair), ui-serif, Georgia, serif",
  };

  // Background theme mapping
  const bgMap: Record<string, { background: string; color: string; cardBg: string; cardBorder: string }> = {
    minimal: {
      background: "#ffffff",
      color: "#0f172a",
      cardBg: "#f8fafc",
      cardBorder: "1px solid #e2e8f0",
    },
    bold: {
      background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
      color: "#f1f5f9",
      cardBg: "rgba(255,255,255,0.05)",
      cardBorder: "1px solid rgba(148, 163, 184, 0.2)",
    },
    elegant: {
      background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #0d1b2a 60%, #0a0a1a 100%)",
      color: "#e2e8f0",
      cardBg: "rgba(255,255,255,0.03)",
      cardBorder: "1px solid rgba(148, 163, 184, 0.15)",
    },
  };

  const selectedFont = fontMap[portfolio.fontStyle] || fontMap.inter;
  const selectedBg = bgMap[portfolio.themeId] || bgMap.elegant;
  const isLight = portfolio.themeId === "minimal";
  const headingColor = isLight ? "#0f172a" : "#ffffff";
  const subColor = isLight ? "#64748b" : "#94a3b8";
  const textColor = isLight ? "#334155" : "rgba(203, 213, 225, 0.9)";

  // Layout variant for projects grid
  const layoutStyle: React.CSSProperties = portfolio.layoutVariant === "grid"
    ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }
    : portfolio.layoutVariant === "sidebar"
    ? { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }
    : { display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" };

  return (
    <div
      className="min-h-screen"
      style={{
        background: selectedBg.background,
        color: selectedBg.color,
        fontFamily: selectedFont,
      }}
    >
      {/* Neon glow effects (only for dark themes) */}
      {!isLight && (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(139, 92, 246, 0.08)" }} />
        <div className="absolute bottom-1/4 left-0 h-[500px] w-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(6, 182, 212, 0.06)" }} />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(236, 72, 153, 0.05)" }} />
      </div>
      )}

      {/* Header */}
      <header className="relative py-20 sm:py-28 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Avatar */}
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full" style={{ border: `3px solid ${portfolio.primaryColor}`, boxShadow: `0 0 30px ${portfolio.primaryColor}40` }}>
            {portfolio.avatarUrl ? (
              <img
                src={portfolio.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: portfolio.primaryColor + "30", color: portfolio.primaryColor }}
              >
                {displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold sm:text-5xl font-heading" style={{ color: headingColor }}>
            {displayName}
          </h1>
          {portfolio.title && portfolio.user.name && (
            <p className="mt-3 text-lg font-medium" style={{ color: portfolio.primaryColor, textShadow: isLight ? "none" : `0 0 10px ${portfolio.primaryColor}60` }}>
              {portfolio.title}
            </p>
          )}
          {portfolio.bio && (
            <p className="mt-5 mx-auto max-w-2xl leading-relaxed" style={{ color: textColor }}>
              {portfolio.bio}
            </p>
          )}

          {/* Social Links */}
          {portfolio.socialLinks.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              {portfolio.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                  style={{
                    border: `1px solid ${portfolio.primaryColor}50`,
                    color: headingColor,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                  aria-label={`Visit ${link.platform} profile`}
                >
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Education */}
        {portfolio.education.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold font-heading" style={{ color: headingColor }}>
              Education
            </h2>
            <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
            <div className="mt-8 space-y-4">
              {portfolio.education.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl p-5"
                  style={{ backgroundColor: selectedBg.cardBg, border: selectedBg.cardBorder }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}>
                      <svg className="h-5 w-5" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: headingColor }}>{edu.degree}</h3>
                      <p className="text-sm" style={{ color: subColor }}>
                        {edu.institution}{edu.startYear ? ` • ${edu.startYear}` : ""}{edu.endYear ? ` - ${edu.endYear}` : ""}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-sm" style={{ color: subColor }}>{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold font-heading" style={{ color: headingColor }}>
              Projects
            </h2>
            <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: portfolio.primaryColor, boxShadow: `0 0 10px ${portfolio.primaryColor}` }} />
            <div className="mt-8" style={layoutStyle}>
              {portfolio.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${slug}/project/${project.id}`}
                  className="rounded-xl p-6 transition-all hover:scale-[1.02] block cursor-pointer"
                  style={{
                    backgroundColor: selectedBg.cardBg,
                    border: selectedBg.cardBorder,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h3 className="text-lg font-semibold" style={{ color: headingColor }}>{project.title}</h3>
                  {project.description && (
                    <p className="mt-2 text-sm line-clamp-3" style={{ color: subColor }}>{project.description}</p>
                  )}
                  {Array.isArray(project.tags) && (project.tags as string[]).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(project.tags as string[]).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: portfolio.primaryColor + "20", color: portfolio.primaryColor }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span
                    className="mt-4 inline-flex items-center text-sm font-medium"
                    style={{ color: portfolio.primaryColor }}
                  >
                    View Details →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold font-heading" style={{ color: headingColor }}>
              Skills
            </h2>
            <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#06b6d4", boxShadow: "0 0 10px #06b6d4" }} />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {portfolio.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: selectedBg.cardBg, border: "1px solid rgba(148, 163, 184, 0.1)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: headingColor }}>{skill.name}</span>
                    <span className="text-sm" style={{ color: subColor }}>{skill.level}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full" style={{ backgroundColor: "rgba(148, 163, 184, 0.15)" }}>
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${skill.level}%`,
                        background: `linear-gradient(90deg, ${portfolio.primaryColor}, #06b6d4)`,
                        boxShadow: `0 0 8px ${portfolio.primaryColor}60`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {portfolio.certifications.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold font-heading" style={{ color: headingColor }}>
              Certifications
            </h2>
            <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#f59e0b", boxShadow: "0 0 10px #f59e0b" }} />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {portfolio.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-xl p-5 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: selectedBg.cardBg,
                    border: selectedBg.cardBorder,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
                      <svg className="h-5 w-5" style={{ color: "#f59e0b" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: headingColor }}>{cert.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: subColor }}>
                        {cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ""}
                      </p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-xs font-medium"
                          style={{ color: "#f59e0b" }}
                        >
                          View Credential →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resume Download */}
        {portfolio.resume && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold font-heading" style={{ color: headingColor }}>
              Resume
            </h2>
            <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#ec4899", boxShadow: "0 0 10px #ec4899" }} />
            <div className="mt-6">
              <a
                href={portfolio.resume.filePath}
                download
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105"
                style={{
                  backgroundColor: portfolio.primaryColor,
                  boxShadow: `0 0 20px ${portfolio.primaryColor}40`,
                }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Resume ({portfolio.resume.fileName})
              </a>
            </div>
          </section>
        )}
      </main>

      {/* Interests & Hobbies */}
      {portfolio.interests.length > 0 && (
        <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-16">
          <h2 className="text-2xl font-bold font-heading" style={{ color: headingColor }}>
            Interests & Hobbies
          </h2>
          <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#ec4899", boxShadow: "0 0 10px #ec4899" }} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {portfolio.interests.map((interest) => (
              <div
                key={interest.id}
                className="rounded-xl p-5 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: selectedBg.cardBg, border: "1px solid rgba(236, 72, 153, 0.2)" }}
              >
                <h3 className="text-sm font-semibold" style={{ color: headingColor }}>{interest.name}</h3>
                {interest.description && (
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: subColor }}>{interest.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact & Footer */}
      <footer className="relative py-12 text-center" style={{ borderTop: isLight ? "1px solid #e2e8f0" : "1px solid rgba(148, 163, 184, 0.1)" }}>
        {/* Contact Me */}
        {(portfolio.contactEmail || portfolio.contactPhone) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: headingColor }}>Contact Me</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {portfolio.contactEmail && (
                <a
                  href={`mailto:${portfolio.contactEmail}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: isLight ? "#f1f5f9" : "rgba(255,255,255,0.05)", border: isLight ? "1px solid #e2e8f0" : `1px solid ${portfolio.primaryColor}40`, color: isLight ? "#334155" : "#e2e8f0" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {portfolio.contactEmail}
                </a>
              )}
              {portfolio.contactPhone && (
                <a
                  href={`https://wa.me/${portfolio.contactPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: isLight ? "#f1f5f9" : "rgba(255,255,255,0.05)", border: isLight ? "1px solid #e2e8f0" : `1px solid ${portfolio.primaryColor}40`, color: isLight ? "#334155" : "#e2e8f0" }}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {portfolio.contactPhone}
                </a>
              )}
            </div>
          </div>
        )}

        <p className="text-sm" style={{ color: subColor }}>
          Built with{" "}
          <Link href="/" className="font-semibold transition-colors" style={{ color: portfolio.primaryColor }}>
            prf
          </Link>
        </p>
      </footer>
    </div>
  );
}
