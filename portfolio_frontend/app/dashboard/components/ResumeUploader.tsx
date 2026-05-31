"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Resume {
  id: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export default function ResumeUploader() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  async function fetchResume() {
    try {
      setLoading(true);
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setResume(data.resume ?? null);
      }
    } catch {
      // Silently fail on initial load
    } finally {
      setLoading(false);
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to upload resume");
      }

      const data = await res.json();
      setResume(data.resume);
      setSuccess("Resume uploaded successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  }, []);

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to remove your resume?");
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/resume", { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete resume");
      }

      setResume(null);
      setSuccess("Resume removed successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection?.errors[0]?.code === "file-too-large") {
        setError("File size must be less than 5MB");
      } else if (rejection?.errors[0]?.code === "file-invalid-type") {
        setError("Only PDF files are allowed");
      } else {
        setError("Invalid file. Please upload a PDF under 5MB.");
      }
    },
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/4 animate-pulse rounded bg-secondary-200" />
        <div className="h-32 animate-pulse rounded-lg bg-secondary-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-secondary-900">Resume</h2>
        <p className="mt-1 text-sm text-secondary-500">
          Upload your resume as a PDF. Visitors can download it from your portfolio.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-700" role="alert">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="rounded-md border border-success-500 bg-success-50 px-4 py-3 text-sm text-success-700" role="status">
          {success}
        </div>
      )}

      {/* Current Resume */}
      {resume && (
        <div className="rounded-lg border border-secondary-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">{resume.fileName}</p>
                <p className="text-xs text-secondary-500">
                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={resume.filePath}
                download
                className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50"
              >
                Download
              </a>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center rounded-md border border-error-500 bg-white px-3 py-1.5 text-sm font-medium text-error-700 transition-colors hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-secondary-300 bg-secondary-50 hover:border-primary-400 hover:bg-primary-50/50"
        } ${uploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-10 w-10 text-secondary-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        {uploading ? (
          <p className="mt-3 text-sm font-medium text-secondary-700">Uploading...</p>
        ) : isDragActive ? (
          <p className="mt-3 text-sm font-medium text-primary-700">Drop your PDF here</p>
        ) : (
          <>
            <p className="mt-3 text-sm font-medium text-secondary-700">
              {resume ? "Drop a new PDF to replace" : "Drop your resume PDF here"}
            </p>
            <p className="mt-1 text-xs text-secondary-500">or click to browse (PDF only, max 5MB)</p>
          </>
        )}
      </div>
    </div>
  );
}
