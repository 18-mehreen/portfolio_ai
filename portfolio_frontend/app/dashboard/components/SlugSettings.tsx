"use client";

import { useState, useEffect } from "react";

interface SlugSettingsProps {
  currentSlug: string | null;
  onUpdate: (slug: string) => void;
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-");
}

function validateSlug(slug: string): string | null {
  if (!slug) return "Slug is required";
  if (slug.length < 3) return "Slug must be at least 3 characters";
  if (slug.length > 50) return "Slug must be 50 characters or fewer";
  if (slug.startsWith("-") || slug.endsWith("-"))
    return "Slug cannot start or end with a hyphen";
  if (!SLUG_REGEX.test(slug))
    return "Only lowercase letters, numbers, and hyphens are allowed";
  return null;
}

export default function SlugSettings({ currentSlug, onUpdate }: SlugSettingsProps) {
  const [slug, setSlug] = useState(currentSlug ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setSlug(currentSlug ?? "");
  }, [currentSlug]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatSlug(e.target.value);
    setSlug(formatted);
    setMessage(null);

    if (formatted) {
      setValidationError(validateSlug(formatted));
    } else {
      setValidationError(null);
    }
  }

  async function handleSave() {
    const error = validateSlug(slug);
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to save slug" });
        return;
      }

      setMessage({ type: "success", text: "Slug saved successfully!" });
      onUpdate(slug);
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = slug !== (currentSlug ?? "");
  const canSave = hasChanges && !validationError && slug.length > 0;

  return (
    <div className="rounded-lg border border-secondary-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Portfolio URL</h3>
        <p className="mt-1 text-sm text-secondary-500">
          Choose a unique slug for your portfolio&apos;s public URL.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-secondary-300 bg-secondary-50 px-3 py-2 text-sm text-secondary-500">
            /portfolio/
          </span>
          <input
            type="text"
            value={slug}
            onChange={handleChange}
            placeholder="my-portfolio"
            aria-label="Portfolio slug"
            aria-describedby="slug-hint"
            className="block w-full rounded-r-md border border-secondary-300 px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <p id="slug-hint" className="text-xs text-secondary-400">
          Lowercase letters, numbers, and hyphens only.
        </p>

        {validationError && (
          <p className="text-sm text-error-500" role="alert">
            {validationError}
          </p>
        )}

        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-success-700" : "text-error-500"
            }`}
            role="alert"
          >
            {message.text}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || saving}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>

          {currentSlug && (
            <span className="text-xs text-secondary-400">
              Current: /portfolio/{currentSlug}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
