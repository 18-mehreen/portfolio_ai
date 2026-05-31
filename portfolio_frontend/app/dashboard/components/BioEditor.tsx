"use client";

import { useState, useEffect } from "react";

interface BioEditorProps {
  currentBio: string | null;
  onSave: (bio: string) => void;
}

export default function BioEditor({ currentBio, onSave }: BioEditorProps) {
  const [bio, setBio] = useState(currentBio ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setBio(currentBio ?? "");
  }, [currentBio]);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save bio");
      }

      setSuccess("Bio saved successfully!");
      onSave(bio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save bio");
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = bio !== (currentBio ?? "");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-secondary-900">Bio / About</h2>
        <p className="mt-1 text-sm text-secondary-500">
          Write your professional bio. This appears at the top of your portfolio.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="rounded-md border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="rounded-md border border-success-500 bg-success-50 px-4 py-3 text-sm text-success-700"
          role="status"
        >
          {success}
        </div>
      )}

      {/* AI Generation Section - Temporarily disabled */}
      <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4 opacity-60">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-secondary-700">AI Bio Generation</h3>
            <p className="text-xs text-secondary-500">Coming soon — write your bio manually for now.</p>
          </div>
        </div>
      </div>

      {/* Bio Textarea */}
      <div>
        <label htmlFor="bio-textarea" className="block text-sm font-medium text-secondary-700">
          Your Bio
        </label>
        <textarea
          id="bio-textarea"
          rows={6}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a few sentences about yourself..."
          className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <p className="mt-1 text-xs text-secondary-400">
          {bio.length} characters
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Save Bio"
          )}
        </button>
        {!hasChanges && bio && (
          <span className="text-xs text-secondary-400">No unsaved changes</span>
        )}
      </div>
    </div>
  );
}
