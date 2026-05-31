"use client";

import { useState, useEffect, useCallback } from "react";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

const PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "website",
  "youtube",
  "dribbble",
  "behance",
  "instagram",
  "medium",
  "dev.to",
];

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/social-links");
      if (!res.ok) throw new Error("Failed to fetch social links");
      const data = await res.json();
      setLinks(data.socialLinks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  function handleAdd() {
    setEditingLink(null);
    setPlatform("");
    setUrl("");
    setShowForm(true);
  }

  function handleEdit(link: SocialLink) {
    setEditingLink(link);
    setPlatform(link.platform);
    setUrl(link.url);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingLink(null);
    setPlatform("");
    setUrl("");
  }

  async function handleSave() {
    if (!platform || !url) {
      setError("Platform and URL are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const endpoint = editingLink
        ? `/api/social-links/${editingLink.id}`
        : "/api/social-links";
      const method = editingLink ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save link");
      }

      setSuccess(editingLink ? "Link updated!" : "Link added!");
      setShowForm(false);
      setEditingLink(null);
      setPlatform("");
      setUrl("");
      fetchLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(link: SocialLink) {
    if (!window.confirm(`Delete ${link.platform} link?`)) return;

    try {
      setDeletingId(link.id);
      const res = await fetch(`/api/social-links/${link.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLinks((prev) => prev.filter((l) => l.id !== link.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/4 animate-pulse rounded bg-secondary-200" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-secondary-900">Social Links</h2>
          <p className="mt-1 text-sm text-secondary-500">Connect your profiles in one place.</p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Add Link
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-700" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-success-500 bg-success-50 px-4 py-3 text-sm text-success-700" role="status">
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-lg border border-secondary-200 bg-white p-5 space-y-4">
          <h3 className="text-lg font-medium text-secondary-900">
            {editingLink ? "Edit Link" : "Add Link"}
          </h3>
          <div>
            <label htmlFor="platform-select" className="block text-sm font-medium text-secondary-700">Platform</label>
            <select
              id="platform-select"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select platform...</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="link-url" className="block text-sm font-medium text-secondary-700">URL</label>
            <input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="mt-1 block w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      {links.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed border-secondary-300 bg-secondary-50 p-10 text-center">
          <p className="text-sm font-medium text-secondary-700">No social links yet. Add your first link!</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Add Link
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-secondary-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 capitalize">
                  {link.platform.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-secondary-900 capitalize">{link.platform}</p>
                  <p className="text-xs text-secondary-500 truncate max-w-[200px] sm:max-w-[300px]">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(link)}
                  className="rounded-md border border-secondary-300 px-2.5 py-1 text-xs font-medium text-secondary-700 hover:bg-secondary-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link)}
                  disabled={deletingId === link.id}
                  className="rounded-md border border-error-500 px-2.5 py-1 text-xs font-medium text-error-700 hover:bg-error-50 disabled:opacity-50"
                >
                  {deletingId === link.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
