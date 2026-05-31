import Link from "next/link";

const samplePortfolios = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Full Stack Web Developer",
    description: "Building modern web apps with React, Next.js & Node.js",
    gradient: "from-violet-600 to-indigo-700",
    hasAvatar: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "DevOps Engineer",
    description: "Automating infrastructure & CI/CD pipelines at scale",
    gradient: "from-cyan-500 to-blue-700",
    hasAvatar: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Arjun Mehta",
    role: "Data Analyst",
    description: "Turning raw data into business insights with Python & SQL",
    gradient: "from-amber-500 to-orange-600",
    hasAvatar: false,
  },
];

export default function SamplePortfoliosSection() {
  return (
    <section id="portfolios" className="py-20 sm:py-28" style={{ backgroundColor: "#f8fafc" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "#0f172a" }}>
            See What Others Built
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#64748b" }}>
            Get inspired by portfolios created with prf. Each one is unique,
            professional, and built in minutes.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {samplePortfolios.map((portfolio) => (
            <Link
              key={portfolio.id}
              href={`/sample/${portfolio.id}`}
              className="group rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              {/* Gradient Header Area */}
              <div
                className={`h-32 bg-gradient-to-br ${portfolio.gradient} flex items-center justify-center relative`}
              >
                {/* Avatar */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-white" style={{ backgroundColor: "#e0e7ff" }}>
                    {portfolio.hasAvatar && portfolio.avatarUrl ? (
                      <img
                        src={portfolio.avatarUrl}
                        alt={portfolio.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold" style={{ color: "#4f46e5", backgroundColor: "#e0e7ff" }}>
                        {portfolio.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="pt-12 pb-6 px-6 text-center">
                <h3 className="text-lg font-semibold transition-colors" style={{ color: "#0f172a" }}>
                  {portfolio.name}
                </h3>
                <p className="mt-1 text-sm font-medium" style={{ color: "#4f46e5" }}>
                  {portfolio.role}
                </p>
                <p className="mt-3 text-sm leading-6" style={{ color: "#64748b" }}>
                  {portfolio.description}
                </p>

                {/* View Portfolio Button */}
                <div className="mt-4 inline-flex items-center text-sm font-semibold transition-colors" style={{ color: "#4f46e5" }}>
                  View Portfolio
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
