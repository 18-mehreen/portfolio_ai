"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { type Project } from "./ProjectsManager";

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditMode = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? "");
  const [projectUrl, setProjectUrl] = useState(project?.projectUrl ?? "");
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const tagInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function addTagsFromInput(value: string) {
    const newTags = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));

    if (newTags.length > 0) {
      setTags((prev) => [...prev, ...newTags]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagsFromInput(tagInput);
    }
  }

  function handleTagInputBlur() {
    if (tagInput.trim()) {
      addTagsFromInput(tagInput);
    }
  }

  function removeTag(tagToRemove: string) {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
        projectUrl: projectUrl.trim() || null,
        tags,
      };

      const url = isEditMode ? `/api/projects/${project!.id}` : "/api/projects";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save project");
      }

      setSuccess(isEditMode ? "Project updated successfully." : "Project created successfully.");

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
        {isEditMode ? "Edit Project" : "Add Project"}
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

      {/* Title */}
      <div>
        <label htmlFor="project-title" className="block text-sm font-medium text-secondary-700">
          Title <span className="text-error-500">*</span>
        </label>
        <input
          id="project-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Project"
          className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="project-description" className="block text-sm font-medium text-secondary-700">
          Description
        </label>
        <textarea
          id="project-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of your project..."
          className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Project Image */}
      <div>
        <label className="block text-sm font-medium text-secondary-700">
          Project Image
        </label>
        {imageUrl ? (
          <div className="mt-2">
            <img src={imageUrl} alt="Project preview" className="h-40 w-full rounded-lg object-cover border border-secondary-200" />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 hover:bg-secondary-50"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="inline-flex items-center rounded-md border border-error-500 bg-white px-3 py-1.5 text-sm font-medium text-error-700 hover:bg-error-50"
              >
                Delete Photo
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary-300 p-6 hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
            onClick={() => imageInputRef.current?.click()}
          >
            <svg className="h-8 w-8 text-secondary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="mt-2 text-sm font-medium text-secondary-600">
              {uploadingImage ? "Uploading..." : "Click to add project image"}
            </p>
            <p className="mt-1 text-xs text-secondary-400">JPG, PNG, WebP or GIF (max 5MB)</p>
          </div>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploadingImage(true);
            setError(null);
            try {
              const formData = new FormData();
              formData.append("file", file);
              const res = await fetch("/api/projects/upload-image", { method: "POST", body: formData });
              if (!res.ok) { const data = await res.json().catch(() => null); throw new Error(data?.error || "Upload failed"); }
              const data = await res.json();
              setImageUrl(data.imageUrl);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Image upload failed");
            } finally {
              setUploadingImage(false);
              e.target.value = "";
            }
          }}
        />
      </div>

      {/* Project URL */}
      <div>
        <label htmlFor="project-url" className="block text-sm font-medium text-secondary-700">
          Project URL
        </label>
        <input
          id="project-url"
          type="url"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          placeholder="https://myproject.com"
          className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="project-tags" className="block text-sm font-medium text-secondary-700">
          Tags
        </label>
        <p className="mt-0.5 text-xs text-secondary-400">
          Type comma-separated values and press Enter to add
        </p>

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-primary-200 hover:text-primary-700"
                  aria-label={`Remove tag ${tag}`}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          id="project-tags"
          ref={tagInputRef}
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={handleTagInputBlur}
          placeholder="react, typescript, nextjs"
          className="mt-2 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
