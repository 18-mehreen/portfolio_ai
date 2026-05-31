"use client";

import { useState, useEffect, useCallback } from "react";

interface Interest {
  id: string;
  name: string;
  description: string | null;
  order: number;
}

export default function InterestsPage() {
  const [items, setItems] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Interest | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/interests");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.interests ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function handleAdd() { setEditing(null); setName(""); setDescription(""); setShowForm(true); }
  function handleEdit(item: Interest) { setEditing(item); setName(item.name); setDescription(item.description || ""); setShowForm(true); }
  function handleCancel() { setShowForm(false); setEditing(null); }

  async function handleSave() {
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      const endpoint = editing ? `/api/interests/${editing.id}` : "/api/interests";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), description: description || null }) });
      if (!res.ok) { const data = await res.json().catch(() => null); throw new Error(data?.error || "Failed"); }
      setSuccess(editing ? "Updated!" : "Added!"); setShowForm(false); setEditing(null); fetchItems();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(item: Interest) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try { setDeletingId(item.id); const res = await fetch(`/api/interests/${item.id}`, { method: "DELETE" }); if (!res.ok) throw new Error("Failed"); setItems(prev => prev.filter(i => i.id !== item.id)); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setDeletingId(null); }
  }

  if (loading) return <div className="mx-auto max-w-3xl p-6"><div className="animate-pulse space-y-4"><div className="h-6 w-1/3 rounded bg-gray-200" /><div className="h-20 rounded-lg bg-gray-100" /></div></div>;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#0f172a" }}>Interests & Hobbies</h2>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>Share what you enjoy outside of work.</p>
        </div>
        {!showForm && <button onClick={handleAdd} className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#4f46e5" }}>Add Interest</button>}
      </div>

      {error && <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #ef4444" }}>{error}</div>}
      {success && <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #22c55e" }}>{success}</div>}

      {showForm && (
        <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <h3 className="text-lg font-medium" style={{ color: "#0f172a" }}>{editing ? "Edit" : "Add"} Interest</h3>
          <div>
            <label className="block text-sm font-medium" style={{ color: "#334155" }}>Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Photography, Gaming, Hiking" className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#cbd5e1" }} />
          </div>
          <div>
            <label className="block text-sm font-medium" style={{ color: "#334155" }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="A short description about this hobby..." className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#cbd5e1" }} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: "#4f46e5" }}>{saving ? "Saving..." : "Save"}</button>
            <button onClick={handleCancel} className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "#cbd5e1", color: "#334155" }}>Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "2px dashed #cbd5e1", backgroundColor: "#f8fafc" }}>
          <p className="text-sm font-medium" style={{ color: "#334155" }}>No interests added yet.</p>
          <button onClick={handleAdd} className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#4f46e5" }}>Add Interest</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="group relative flex items-start justify-between rounded-lg p-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{item.name}</p>
                {item.description && <p className="mt-1 text-xs" style={{ color: "#64748b" }}>{item.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="rounded border px-2.5 py-1 text-xs font-medium" style={{ borderColor: "#cbd5e1", color: "#334155" }}>Edit</button>
                <button onClick={() => handleDelete(item)} disabled={deletingId === item.id} className="rounded border px-2.5 py-1 text-xs font-medium disabled:opacity-50" style={{ borderColor: "#ef4444", color: "#b91c1c" }}>{deletingId === item.id ? "..." : "Delete"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
