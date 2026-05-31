"use client";

import { useState, useRef } from "react";

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  onUpdate: (url: string) => void;
}

export default function AvatarUploader({ currentAvatarUrl, onUpdate }: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to upload image");
      }

      const data = await res.json();
      setAvatarUrl(data.avatarUrl);
      onUpdate(data.avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!window.confirm("Remove your profile picture? It will show your initials instead.")) return;
    try {
      setUploading(true);
      setError(null);
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });
      if (!res.ok) throw new Error("Failed to remove");
      setAvatarUrl(null);
      onUpdate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-lg border border-secondary-200 bg-white p-6">
      <h3 className="text-lg font-semibold" style={{ color: "#0f172a" }}>Profile Picture</h3>
      <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
        Add a photo to personalize your portfolio.
      </p>

      <div className="mt-4 flex items-center gap-6">
        {/* Avatar Preview */}
        <div
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
          style={{ backgroundColor: "#e0e7ff", border: "2px solid #c7d2fe" }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg className="h-10 w-10" style={{ color: "#6366f1" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#4f46e5" }}
            >
              {uploading ? "Uploading..." : avatarUrl ? "Change Photo" : "Upload Photo"}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                style={{ borderColor: "#ef4444", color: "#b91c1c" }}
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            JPG, PNG, WebP or GIF. Max 2MB.
          </p>
          {error && (
            <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
