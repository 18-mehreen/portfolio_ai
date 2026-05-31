"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setContactEmail(data.portfolio?.contactEmail || "");
          setContactPhone(data.portfolio?.contactPhone || "");
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactEmail: contactEmail.trim() || null,
          contactPhone: contactPhone.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save");
      }

      setSuccess("Contact info saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: "#0f172a" }}>Contact Information</h2>
        <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
          Add your contact details so visitors can reach you. This will appear in your portfolio footer.
        </p>
      </div>

      {error && <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #ef4444" }}>{error}</div>}
      {success && <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #22c55e" }}>{success}</div>}

      <div className="rounded-lg p-6 space-y-5" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium" style={{ color: "#334155" }}>
            Email Address
          </label>
          <div className="mt-1 flex items-center gap-2">
            <svg className="h-5 w-5 shrink-0" style={{ color: "#64748b" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              className="block w-full rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: "#cbd5e1" }}
            />
          </div>
          <p className="mt-1 text-xs" style={{ color: "#94a3b8" }}>Visitors can click to email you directly</p>
        </div>

        {/* Phone / WhatsApp */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium" style={{ color: "#334155" }}>
            Phone / WhatsApp Number
          </label>
          <div className="mt-1 flex items-center gap-2">
            <svg className="h-5 w-5 shrink-0" style={{ color: "#64748b" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+923328479890"
              className="block w-full rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: "#cbd5e1" }}
            />
          </div>
          <p className="mt-1 text-xs" style={{ color: "#94a3b8" }}>Include country code (e.g. +92). Used for WhatsApp link too.</p>
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "#4f46e5" }}
        >
          {saving ? "Saving..." : "Save Contact Info"}
        </button>
      </div>
    </div>
  );
}
