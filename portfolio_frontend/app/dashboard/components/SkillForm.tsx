"use client";

import { useState, type FormEvent } from "react";
import { type Skill } from "./SkillsManager";

interface SkillFormProps {
  skill?: Skill | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SkillForm({ skill, onSuccess, onCancel }: SkillFormProps) {
  const isEditMode = Boolean(skill);

  const [name, setName] = useState(skill?.name ?? "");
  const [level, setLevel] = useState(skill?.level ?? 50);
  const [category, setCategory] = useState(skill?.category ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        level,
        category: category.trim() || null,
      };

      const url = isEditMode ? `/api/skills/${skill!.id}` : "/api/skills";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save skill");
      }

      setSuccess(isEditMode ? "Skill updated successfully." : "Skill created successfully.");

      // Brief delay so user sees the success message before closing
      setTimeout(() => {
        onSuccess();
      }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-secondary-900">
        {isEditMode ? "Edit Skill" : "Add Skill"}
      </h2>

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

      {/* Name */}
      <div>
        <label htmlFor="skill-name" className="block text-sm font-medium text-secondary-700">
          Name <span className="text-error-500">*</span>
        </label>
        <input
          id="skill-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, TypeScript, Python"
          className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Level (range slider) */}
      <div>
        <label htmlFor="skill-level" className="block text-sm font-medium text-secondary-700">
          Level
        </label>
        <div className="mt-1 flex items-center gap-3">
          <input
            id="skill-level"
            type="range"
            min={1}
            max={100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary-200 accent-primary-600"
          />
          <span className="min-w-[2.5rem] text-center text-sm font-medium text-secondary-700">
            {level}
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="skill-category" className="block text-sm font-medium text-secondary-700">
          Category
        </label>
        <input
          id="skill-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Frontend, Backend, DevOps"
          className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
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
          )}
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
