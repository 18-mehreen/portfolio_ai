"use client";

import { useState, useEffect, useCallback } from "react";

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string | null;
  order: number;
}

interface SkillsManagerProps {
  onEdit: (skill: Skill) => void;
  onAdd: () => void;
}

export default function SkillsManager({ onEdit, onAdd }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/skills");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch skills");
      }

      const data = await res.json();
      setSkills(data.skills ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  async function handleDelete(skill: Skill) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(skill.id);

      const res = await fetch(`/api/skills/${skill.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete skill");
      }

      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const currentSkill = skills[index];
    const adjacentSkill = skills[targetIndex];

    // Optimistic update: swap in local state immediately
    const updatedSkills = [...skills];
    const currentOrder = currentSkill.order;
    const adjacentOrder = adjacentSkill.order;

    updatedSkills[index] = { ...currentSkill, order: adjacentOrder };
    updatedSkills[targetIndex] = { ...adjacentSkill, order: currentOrder };

    // Sort by order to reflect new positions
    updatedSkills.sort((a, b) => a.order - b.order);
    setSkills(updatedSkills);
    setReorderingId(currentSkill.id);

    try {
      // Update both skills' order values on the server
      const [res1, res2] = await Promise.all([
        fetch(`/api/skills/${currentSkill.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: adjacentOrder }),
        }),
        fetch(`/api/skills/${adjacentSkill.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Failed to update skill order");
      }
    } catch (err) {
      // Revert on failure
      setError(err instanceof Error ? err.message : "Failed to reorder skill");
      setSkills(skills);
    } finally {
      setReorderingId(null);
    }
  }

  function getLevelColor(level: number): string {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-blue-500";
    if (level >= 40) return "bg-yellow-500";
    if (level >= 20) return "bg-orange-500";
    return "bg-red-500";
  }

  // Loading state with skeleton placeholders
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Skills</h2>
          <div className="h-9 w-24 animate-pulse rounded-md bg-secondary-200" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-secondary-200 bg-white p-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-1/4 animate-pulse rounded bg-secondary-200" />
                  <div className="h-4 w-10 animate-pulse rounded bg-secondary-100" />
                </div>
                <div className="h-3 w-full animate-pulse rounded-full bg-secondary-100" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-secondary-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Skills</h2>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Skill
          </button>
        </div>
        <div className="rounded-lg border border-error-500 bg-error-50 p-4" role="alert">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-error-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-error-700">{error}</p>
              <button
                type="button"
                onClick={fetchSkills}
                className="mt-2 text-sm font-medium text-error-700 underline hover:text-error-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (skills.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Skills</h2>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Skill
          </button>
        </div>
        <div className="rounded-lg border border-dashed border-secondary-300 bg-secondary-50 p-10 text-center">
          <svg
            className="mx-auto h-12 w-12 text-secondary-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-secondary-700">
            No skills yet. Add your first skill!
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Skill
          </button>
        </div>
      </div>
    );
  }

  // Skills list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary-900">Skills</h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Skill
        </button>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className="rounded-lg border border-secondary-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-secondary-900">
                    {skill.name}
                  </h3>
                  {skill.category && (
                    <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {skill.category}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-secondary-500">Level</span>
                    <span className="text-xs font-medium text-secondary-700">
                      {skill.level}%
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full rounded-full bg-secondary-100"
                    role="progressbar"
                    aria-valuenow={skill.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} skill level: ${skill.level}%`}
                  >
                    <div
                      className={`h-2.5 rounded-full transition-all ${getLevelColor(skill.level)}`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 mr-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, "up")}
                      disabled={reorderingId !== null}
                      className="inline-flex items-center justify-center rounded p-1 text-secondary-500 transition-colors hover:bg-secondary-100 hover:text-secondary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Move ${skill.name} up`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                  )}
                  {index < skills.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, "down")}
                      disabled={reorderingId !== null}
                      className="inline-flex items-center justify-center rounded p-1 text-secondary-500 transition-colors hover:bg-secondary-100 hover:text-secondary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Move ${skill.name} down`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onEdit(skill)}
                  className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  aria-label={`Edit ${skill.name}`}
                >
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill)}
                  disabled={deletingId === skill.id}
                  className="inline-flex items-center rounded-md border border-error-500 bg-white px-3 py-1.5 text-sm font-medium text-error-700 transition-colors hover:bg-error-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error-500 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Delete ${skill.name}`}
                >
                  {deletingId === skill.id ? (
                    <svg
                      className="mr-1 h-4 w-4 animate-spin"
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
                  ) : (
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
