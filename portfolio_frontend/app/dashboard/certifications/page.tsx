"use client";

import { useState, useEffect, useCallback } from "react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string | null;
  credentialUrl: string | null;
  order: number;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  const fetchCertifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/certifications");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCertifications(data.certifications ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCertifications(); }, [fetchCertifications]);

  function handleAdd() {
    setEditing(null);
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setCredentialUrl("");
    setShowForm(true);
  }

  function handleEdit(cert: Certification) {
    setEditing(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate || "");
    setCredentialUrl(cert.credentialUrl || "");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSave() {
    if (!title.trim() || !issuer.trim()) {
      setError("Title and Issuer are required");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = editing ? `/api/certifications/${editing.id}` : "/api/certifications";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), issuer: issuer.trim(), issueDate: issueDate || null, credentialUrl: credentialUrl || null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save");
      }

      setSuccess(editing ? "Updated!" : "Added!");
      setShowForm(false);
      setEditing(null);
      fetchCertifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cert: Certification) {
    if (!window.confirm(`Delete "${cert.title}"?`)) return;
    try {
      setDeletingId(cert.id);
      const res = await fetch(`/api/certifications/${cert.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCertifications((prev) => prev.filter((c) => c.id !== cert.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-lg bg-gray-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#0f172a" }}>Certifications</h2>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>Showcase your certifications and credentials.</p>
        </div>
        {!showForm && (
          <button onClick={handleAdd} className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#4f46e5" }}>
            Add Certification
          </button>
        )}
      </div>

      {error && <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #ef4444" }}>{error}</div>}
      {success && <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #22c55e" }}>{success}</div>}

      {/* Form */}
      {showForm && (
        <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <h3 className="text-lg font-medium" style={{ color: "#0f172a" }}>{editing ? "Edit" : "Add"} Certification</h3>
          <div>
            <label className="block text-sm font-medium" style={{ color: "#334155" }}>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AWS Solutions Architect" className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#cbd5e1" }} />
          </div>
          <div>
            <label className="block text-sm font-medium" style={{ color: "#334155" }}>Issuer *</label>
            <input type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Amazon Web Services" className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#cbd5e1" }} />
          </div>
          <div>
            <label className="block text-sm font-medium" style={{ color: "#334155" }}>Issue Date</label>
            <input type="text" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} placeholder="Jan 2024" className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#cbd5e1" }} />
          </div>
          <div>
            <label className="block text-sm font-medium" style={{ color: "#334155" }}>Credential URL</label>
            <input type="url" value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} placeholder="https://credential.net/..." className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#cbd5e1" }} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: "#4f46e5" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancel} className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "#cbd5e1", color: "#334155" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {certifications.length === 0 && !showForm ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "2px dashed #cbd5e1", backgroundColor: "#f8fafc" }}>
          <p className="text-sm font-medium" style={{ color: "#334155" }}>No certifications yet. Add your first one!</p>
          <button onClick={handleAdd} className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#4f46e5" }}>
            Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between rounded-lg p-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{cert.title}</p>
                <p className="text-xs" style={{ color: "#64748b" }}>{cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ""}</p>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: "#4f46e5" }}>
                    View Credential →
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cert)} className="rounded border px-2.5 py-1 text-xs font-medium" style={{ borderColor: "#cbd5e1", color: "#334155" }}>Edit</button>
                <button onClick={() => handleDelete(cert)} disabled={deletingId === cert.id} className="rounded border px-2.5 py-1 text-xs font-medium disabled:opacity-50" style={{ borderColor: "#ef4444", color: "#b91c1c" }}>
                  {deletingId === cert.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
