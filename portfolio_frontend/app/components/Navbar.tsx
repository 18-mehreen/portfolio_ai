"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Portfolios", href: "#portfolios" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[9999] w-full shadow-sm"
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="prf" className="h-8 w-8" />
            <span className="text-xl font-bold" style={{ color: "#4f46e5" }}>prf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  handleAnchorClick(e, link.href);
                  if (!link.href.startsWith("#")) {
                    setMobileMenuOpen(false);
                  }
                }}
                className="block rounded-md px-3 py-2 text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 block rounded-lg bg-primary-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
