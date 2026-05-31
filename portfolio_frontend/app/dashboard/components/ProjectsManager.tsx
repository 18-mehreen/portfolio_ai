"use client";

import { useState, useEffect, useCallback } from "react";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
  tags: string[];
  order: number;
  createdAt: string;
}

interface ProjectsManagerProps {
  onEdit: (project: Project) => void;
  onAdd: () => void;
}

export default function ProjectsManager({ onEdit, onAdd }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/projects");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch projects");
      }

      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(project.id);

      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const currentProject = projects[index];
    const adjacentProject = projects[targetIndex];

    // Optimistic update: swap in local state immediately
    const updatedProjects = [...projects];
    const currentOrder = currentProject.order;
    const adjacentOrder = adjacentProject.order;

    updatedProjects[index] = { ...currentProject, order: adjacentOrder };
    updatedProjects[targetIndex] = { ...adjacentProject, order: currentOrder };

    // Sort by order to reflect new positions
    updatedProjects.sort((a, b) => a.order - b.order);
    setProjects(updatedProjects);
    setReorderingId(currentProject.id);

    try {
      // Update both projects' order values on the server
      const [res1, res2] = await Promise.all([
        fetch(`/api/projects/${currentProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: adjacentOrder }),
        }),
        fetch(`/api/projects/${adjacentProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Failed to update project order");
      }
    } catch (err) {
      // Revert on failure
      setError(err instanceof Error ? err.message : "Failed to reorder project");
      setProjects(projects);
    } finally {
      setReorderingId(null);
    }
  }

  function truncateDescription(description: string | null, maxLength = 120): string {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trimEnd() + "…";
  }

  // Loading state with skeleton placeholders
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Projects</h2>
          <div className="h-9 w-28 animate-pulse rounded-md bg-secondary-200" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-secondary-200 bg-white p-5"
            >
              <div className="space-y-3">
                <div className="h-5 w-1/3 animate-pulse rounded bg-secondary-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-secondary-100" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-secondary-100" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-secondary-100" />
                </div>
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
          <h2 className="text-xl font-semibold text-secondary-900">Projects</h2>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Project
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
                onClick={fetchProjects}
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
  if (projects.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Projects</h2>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Project
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
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-secondary-700">
            No projects yet. Add your first project!
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add Project
          </button>
        </div>
      </div>
    );
  }

  // Projects list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary-900">Projects</h2>
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
          Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="rounded-lg border border-secondary-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-secondary-900">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="mt-1 text-sm text-secondary-500">
                    {truncateDescription(project.description)}
                  </p>
                )}

                {project.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                    View project
                  </a>
                )}
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
                      aria-label={`Move ${project.title} up`}
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
                  {index < projects.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(index, "down")}
                      disabled={reorderingId !== null}
                      className="inline-flex items-center justify-center rounded p-1 text-secondary-500 transition-colors hover:bg-secondary-100 hover:text-secondary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Move ${project.title} down`}
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
                  onClick={() => onEdit(project)}
                  className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  aria-label={`Edit ${project.title}`}
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
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                  className="inline-flex items-center rounded-md border border-error-500 bg-white px-3 py-1.5 text-sm font-medium text-error-700 transition-colors hover:bg-error-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error-500 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Delete ${project.title}`}
                >
                  {deletingId === project.id ? (
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
