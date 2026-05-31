import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
      {/* Neon background effects */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-[500px] w-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(139, 92, 246, 0.3)" }} />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-[400px] w-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(6, 182, 212, 0.25)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(236, 72, 153, 0.2)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tagline */}
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "#ffffff" }}>
            Build Your Professional Portfolio{" "}
            <span style={{ color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.5)" }}>in Minutes</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 sm:text-xl" style={{ color: "rgba(226, 232, 240, 0.9)" }}>
            Create a stunning developer portfolio powered by AI. Showcase your
            projects, skills, and experience with a beautiful, customizable
            theme — no design skills required.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              style={{ backgroundColor: "#8b5cf6", boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
            >
              Get Started
            </Link>
            <Link
              href="#portfolios"
              className="inline-flex items-center justify-center rounded-lg border px-8 py-3.5 text-base font-semibold transition-colors"
              style={{ borderColor: "rgba(167, 139, 250, 0.5)", color: "#e2e8f0", backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              View Samples
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
