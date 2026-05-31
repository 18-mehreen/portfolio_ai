import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 py-20 sm:py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 h-[400px] w-[400px] rounded-full bg-accent-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Build Your Portfolio?
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/80 sm:text-xl">
            Join thousands of developers showcasing their work with a
            professional, AI-powered portfolio. Get started in minutes.
          </p>
          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-white px-10 py-4 text-lg font-semibold text-primary-600 shadow-lg transition-all hover:bg-primary-50 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
