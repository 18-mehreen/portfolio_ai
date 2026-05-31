import Link from "next/link";
import { notFound } from "next/navigation";

const samplePortfolios: Record<string, {
  name: string;
  role: string;
  bio: string;
  primaryColor: string;
  hasAvatar: boolean;
  avatarUrl?: string;
  projects: { title: string; description: string; tags: string[]; url?: string; image?: string }[];
  skills: { name: string; level: number }[];
  certifications: { title: string; issuer: string; date: string; url?: string }[];
  socialLinks: { platform: string; url: string }[];
  resumeAvailable: boolean;
}> = {
  "1": {
    name: "Rahul Sharma",
    role: "Full Stack Web Developer",
    bio: "I'm a passionate full-stack developer with 4+ years of experience building scalable web applications. I specialize in React, Next.js, and Node.js ecosystems, and I love turning complex problems into elegant, user-friendly solutions.",
    primaryColor: "#7c3aed",
    hasAvatar: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    projects: [
      {
        title: "ShopFlow - E-commerce Platform",
        description: "A full-featured e-commerce platform with real-time inventory management, Stripe payment processing, admin dashboard, and multi-vendor support. Built with Next.js 14, Prisma, and PostgreSQL.",
        tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS", "Prisma"],
        url: "https://github.com/rahul/shopflow",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop",
      },
      {
        title: "ChatSync - Real-time Messaging",
        description: "Scalable messaging app supporting group chats, file sharing, read receipts, and end-to-end encryption. Handles 10K+ concurrent connections using WebSockets and Redis pub/sub.",
        tags: ["React", "Socket.io", "Node.js", "Redis", "MongoDB"],
        url: "https://github.com/rahul/chatsync",
      },
      {
        title: "DevBoard - Developer Dashboard",
        description: "Unified dashboard aggregating GitHub activity, Jira tickets, CI/CD status, and team metrics. Features customizable widgets and real-time notifications.",
        tags: ["TypeScript", "React", "GraphQL", "Docker"],
        url: "https://github.com/rahul/devboard",
      },
    ],
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "Node.js / Express", level: 90 },
      { name: "TypeScript", level: 88 },
      { name: "PostgreSQL / MongoDB", level: 82 },
      { name: "Docker & CI/CD", level: 75 },
      { name: "AWS (EC2, S3, Lambda)", level: 70 },
    ],
    certifications: [
      { title: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "Mar 2024", url: "https://aws.amazon.com/certification" },
      { title: "Meta Front-End Developer", issuer: "Meta (Coursera)", date: "Jan 2023" },
    ],
    socialLinks: [
      { platform: "github", url: "https://github.com/rahulsharma" },
      { platform: "linkedin", url: "https://linkedin.com/in/rahulsharma" },
      { platform: "twitter", url: "https://twitter.com/rahuldev" },
      { platform: "website", url: "https://rahulsharma.dev" },
    ],
    resumeAvailable: true,
  },
  "2": {
    name: "Priya Patel",
    role: "DevOps Engineer",
    bio: "DevOps engineer with a passion for automating everything. I design and maintain cloud infrastructure, build CI/CD pipelines, and ensure 99.9% uptime for production systems serving millions of users.",
    primaryColor: "#0891b2",
    hasAvatar: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    projects: [
      {
        title: "InfraForge - IaC Framework",
        description: "Custom Infrastructure-as-Code framework built on top of Terraform and Pulumi. Provides opinionated modules for AWS/GCP with built-in security policies, cost estimation, and drift detection.",
        tags: ["Terraform", "AWS", "Python", "Go", "GitHub Actions"],
        url: "https://github.com/priya/infraforge",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop",
      },
      {
        title: "PipelineX - CI/CD Orchestrator",
        description: "Multi-cloud CI/CD orchestration tool that unifies GitHub Actions, GitLab CI, and Jenkins pipelines into a single dashboard with approval workflows and rollback capabilities.",
        tags: ["Kubernetes", "Docker", "Node.js", "React", "gRPC"],
        url: "https://github.com/priya/pipelinex",
      },
      {
        title: "MonitorStack - Observability Platform",
        description: "Full observability stack combining metrics (Prometheus), logs (Loki), and traces (Jaeger) with custom alerting rules and SLO tracking dashboards.",
        tags: ["Prometheus", "Grafana", "Kubernetes", "Helm", "AlertManager"],
        url: "https://github.com/priya/monitorstack",
      },
    ],
    skills: [
      { name: "Kubernetes / Docker", level: 95 },
      { name: "AWS / GCP", level: 92 },
      { name: "Terraform / Pulumi", level: 90 },
      { name: "CI/CD (GitHub Actions, Jenkins)", level: 88 },
      { name: "Python / Bash Scripting", level: 85 },
      { name: "Monitoring (Prometheus, Grafana)", level: 82 },
    ],
    certifications: [
      { title: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "Jun 2024", url: "https://www.cncf.io/certification/cka/" },
      { title: "AWS Solutions Architect – Professional", issuer: "Amazon Web Services", date: "Nov 2023", url: "https://aws.amazon.com/certification" },
      { title: "HashiCorp Terraform Associate", issuer: "HashiCorp", date: "Aug 2023" },
    ],
    socialLinks: [
      { platform: "github", url: "https://github.com/priyapatel" },
      { platform: "linkedin", url: "https://linkedin.com/in/priyapatel" },
      { platform: "dev.to", url: "https://dev.to/priyaops" },
    ],
    resumeAvailable: true,
  },
  "3": {
    name: "Arjun Mehta",
    role: "Data Analyst",
    bio: "Data analyst who loves finding stories in numbers. I combine SQL, Python, and visualization tools to help businesses make data-driven decisions. Currently focused on product analytics and A/B testing.",
    primaryColor: "#d97706",
    hasAvatar: false,
    projects: [
      {
        title: "RetentionIQ - Churn Prediction",
        description: "End-to-end churn prediction pipeline that identifies at-risk customers 30 days in advance. Includes feature engineering, model training (XGBoost), and an interactive Streamlit dashboard for the business team.",
        tags: ["Python", "scikit-learn", "Streamlit", "SQL", "Pandas"],
        url: "https://github.com/arjun/retentioniq",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
      },
      {
        title: "ABTest Studio",
        description: "Statistical A/B testing framework with Bayesian and frequentist analysis, automatic sample size calculation, and executive-friendly reports. Used by 3 product teams internally.",
        tags: ["Python", "Statistics", "React", "D3.js", "FastAPI"],
        url: "https://github.com/arjun/abtest-studio",
      },
      {
        title: "Sales Pulse Dashboard",
        description: "Real-time sales analytics dashboard tracking KPIs, regional performance, and forecasting. Processes 2M+ daily events and serves insights to 50+ stakeholders.",
        tags: ["Tableau", "SQL", "dbt", "Snowflake", "Airflow"],
      },
    ],
    skills: [
      { name: "SQL (PostgreSQL, Snowflake)", level: 95 },
      { name: "Python (Pandas, NumPy)", level: 90 },
      { name: "Data Visualization (Tableau, D3)", level: 88 },
      { name: "Statistics & A/B Testing", level: 85 },
      { name: "dbt / Airflow / ETL", level: 78 },
      { name: "Machine Learning Basics", level: 70 },
    ],
    certifications: [
      { title: "Google Data Analytics Professional", issuer: "Google (Coursera)", date: "Feb 2024", url: "https://grow.google/certificates/data-analytics" },
      { title: "Tableau Desktop Specialist", issuer: "Tableau / Salesforce", date: "Sep 2023" },
    ],
    socialLinks: [
      { platform: "github", url: "https://github.com/arjunmehta" },
      { platform: "linkedin", url: "https://linkedin.com/in/arjunmehta" },
      { platform: "medium", url: "https://medium.com/@arjundata" },
    ],
    resumeAvailable: false,
  },
};

export default async function SamplePortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolio = samplePortfolios[id];

  if (!portfolio) {
    notFound();
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #0d1b2a 60%, #0a0a1a 100%)",
        color: "#e2e8f0",
      }}
    >
      {/* Neon glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full blur-3xl" style={{ backgroundColor: `${portfolio.primaryColor}15` }} />
        <div className="absolute bottom-1/4 left-0 h-[500px] w-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(6, 182, 212, 0.06)" }} />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(236, 72, 153, 0.05)" }} />
      </div>

      {/* Back Navigation */}
      <div className="relative" style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#94a3b8" }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="relative py-20 sm:py-28 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Avatar */}
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full" style={{ border: `3px solid ${portfolio.primaryColor}`, boxShadow: `0 0 30px ${portfolio.primaryColor}40` }}>
            {portfolio.hasAvatar && portfolio.avatarUrl ? (
              <img src={portfolio.avatarUrl} alt={portfolio.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold" style={{ backgroundColor: portfolio.primaryColor + "30", color: portfolio.primaryColor }}>
                {portfolio.name.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold sm:text-5xl font-heading" style={{ color: "#ffffff" }}>
            {portfolio.name}
          </h1>
          <p className="mt-3 text-lg font-medium" style={{ color: portfolio.primaryColor, textShadow: `0 0 10px ${portfolio.primaryColor}60` }}>
            {portfolio.role}
          </p>
          <p className="mt-5 mx-auto max-w-2xl leading-relaxed" style={{ color: "rgba(203, 213, 225, 0.9)" }}>
            {portfolio.bio}
          </p>

          {/* Social Links */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {portfolio.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{ border: `1px solid ${portfolio.primaryColor}50`, color: "#e2e8f0", backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <span className="capitalize">{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Projects */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold font-heading" style={{ color: "#ffffff" }}>Projects</h2>
          <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: portfolio.primaryColor, boxShadow: `0 0 10px ${portfolio.primaryColor}` }} />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.projects.map((project) => (
              <div
                key={project.title}
                className="rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(148, 163, 184, 0.15)" }}
              >
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-full h-36 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-base font-semibold" style={{ color: "#f1f5f9" }}>{project.title}</h3>
                  <p className="mt-2 text-sm line-clamp-3" style={{ color: "rgba(148, 163, 184, 0.9)" }}>{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: portfolio.primaryColor + "20", color: portfolio.primaryColor }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center text-xs font-medium" style={{ color: portfolio.primaryColor }}>
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold font-heading" style={{ color: "#ffffff" }}>Skills</h2>
          <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#06b6d4", boxShadow: "0 0 10px #06b6d4" }} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {portfolio.skills.map((skill) => (
              <div key={skill.name} className="rounded-lg p-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "#f1f5f9" }}>{skill.name}</span>
                  <span className="text-sm" style={{ color: "#94a3b8" }}>{skill.level}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full" style={{ backgroundColor: "rgba(148, 163, 184, 0.15)" }}>
                  <div className="h-2.5 rounded-full" style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${portfolio.primaryColor}, #06b6d4)`, boxShadow: `0 0 8px ${portfolio.primaryColor}60` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold font-heading" style={{ color: "#ffffff" }}>Certifications</h2>
          <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#f59e0b", boxShadow: "0 0 10px #f59e0b" }} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {portfolio.certifications.map((cert) => (
              <div key={cert.title} className="rounded-xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(148, 163, 184, 0.15)" }}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
                    <svg className="h-5 w-5" style={{ color: "#f59e0b" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>{cert.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{cert.issuer} • {cert.date}</p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-xs font-medium" style={{ color: "#f59e0b" }}>
                        View Credential →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resume */}
        {portfolio.resumeAvailable && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold font-heading" style={{ color: "#ffffff" }}>Resume</h2>
            <div className="mt-2 h-0.5 w-12 rounded" style={{ backgroundColor: "#ec4899", boxShadow: "0 0 10px #ec4899" }} />
            <div className="mt-6">
              <button
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: portfolio.primaryColor, boxShadow: `0 0 20px ${portfolio.primaryColor}40` }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Resume (PDF)
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative py-8 text-center" style={{ borderTop: "1px solid rgba(148, 163, 184, 0.1)" }}>
        <p className="text-sm" style={{ color: "#64748b" }}>
          This is a sample portfolio built with{" "}
          <Link href="/" className="font-semibold" style={{ color: portfolio.primaryColor }}>prf</Link>
          . Create your own in minutes.
        </p>
      </footer>
    </div>
  );
}
