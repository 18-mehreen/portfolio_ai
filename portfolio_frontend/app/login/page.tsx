"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-secondary-200">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <img src="/icon.png" alt="prf" className="h-10 w-10" />
              <h1 className="font-heading text-3xl font-bold tracking-tight text-primary-600">
                prf
              </h1>
            </div>
            <p className="mt-2 text-sm text-secondary-500">
              Sign in to your portfolio dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                aria-describedby={error ? "login-error" : undefined}
                className="mt-1.5 block w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                className="mt-1.5 block w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-secondary-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 transition-colors hover:text-primary-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
