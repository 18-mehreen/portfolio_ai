"use client";

import { useState, useEffect } from "react";

const PRESETS = [
  { id: "minimal", name: "Minimal (Light)", description: "White background, clean and professional", preview: "#ffffff" },
  { id: "bold", name: "Bold (Dark)", description: "Dark slate background, modern look", preview: "#1e293b" },
  { id: "elegant", name: "Neon (Default)", description: "Dark neon purple with glow effects", preview: "#1a0a2e" },
];

const FONTS = [
  { id: "inter", name: "Inter", className: "font-sans" },
  { id: "poppins", name: "Poppins", className: "font-heading" },
  { id: "playfair", name: "Playfair Display", className: "font-display" },
];

const LAYOUTS = [
  { id: "single-column", name: "Single Column" },
  { id: "grid", name: "Grid" },
  { id: "sidebar", name: "Sidebar" },
];

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b",
  "#22c55e", "#06b6d4", "#3b82f6", "#1e293b", "#6b7280",
];

export default function ThemePage() {
  const [themeId, setThemeId] = useState("minimal");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [fontStyle, setFontStyle] = useState("inter");
  const [layoutVariant, setLayoutVariant] = useState("single-column");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const res = await fetch("/api/theme");
        if (res.ok) {
          const data = await res.json();
          setThemeId(data.theme.themeId || "minimal");
          setPrimaryColor(data.theme.primaryColor || "#6366f1");
          setFontStyle(data.theme.fontStyle || "inter");
          setLayoutVariant(data.theme.layoutVariant || "single-column");
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchTheme();
  }, []);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, primaryColor, fontStyle, layoutVariant }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save theme");
      }

      setSuccess("Theme saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-1/4 rounded bg-secondary-200" />
          <div className="h-40 rounded-lg bg-secondary-100" />
          <div className="h-32 rounded-lg bg-secondary-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-secondary-900">Theme Customization</h2>
        <p className="mt-1 text-sm text-secondary-500">Personalize your portfolio&apos;s look and feel.</p>
      </div>

      {error && (
        <div className="rounded-md border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-700" role="alert">{error}</div>
      )}
      {success && (
        <div className="rounded-md border border-success-500 bg-success-50 px-4 py-3 text-sm text-success-700" role="status">{success}</div>
      )}

      {/* Background Theme */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium" style={{ color: "#334155" }}>Background Theme</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setThemeId(preset.id)}
              className="rounded-lg border-2 p-4 text-left transition-all"
              style={{
                borderColor: themeId === preset.id ? "#4f46e5" : "#e2e8f0",
                backgroundColor: themeId === preset.id ? "#eef2ff" : "#ffffff",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: preset.preview, borderColor: "#cbd5e1" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{preset.name}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>{preset.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-secondary-700">Primary Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setPrimaryColor(color)}
              className={`h-9 w-9 rounded-full border-2 transition-all ${
                primaryColor === color ? "border-secondary-900 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-full border-2 border-secondary-200"
            aria-label="Custom color picker"
          />
        </div>
      </div>

      {/* Font Style */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-secondary-700">Font Style</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => setFontStyle(font.id)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                fontStyle === font.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-secondary-200 bg-white hover:border-secondary-300"
              }`}
            >
              <p className={`text-base font-semibold text-secondary-900 ${font.className}`}>{font.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Variant */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-secondary-700">Layout</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => setLayoutVariant(layout.id)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                layoutVariant === layout.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-secondary-200 bg-white hover:border-secondary-300"
              }`}
            >
              <p className="text-sm font-semibold text-secondary-900">{layout.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium" style={{ color: "#334155" }}>Live Preview</h3>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
          <div className="p-6" style={{
            background: themeId === "minimal" ? "#ffffff" : themeId === "bold" ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 50%, #0d1b2a 100%)",
            fontFamily: fontStyle === "poppins" ? "Poppins, sans-serif" : fontStyle === "playfair" ? "Playfair Display, serif" : "Inter, sans-serif",
          }}>
            {/* Mini portfolio preview */}
            <div className="text-center mb-4">
              <div className="mx-auto h-10 w-10 rounded-full" style={{ backgroundColor: primaryColor + "30", border: `2px solid ${primaryColor}` }} />
              <div className="mt-2 h-3 w-20 mx-auto rounded" style={{ backgroundColor: themeId === "minimal" ? "#0f172a" : "#ffffff" }} />
              <div className="mt-1 h-2 w-16 mx-auto rounded" style={{ backgroundColor: primaryColor }} />
            </div>
            {/* Projects preview */}
            <div className={layoutVariant === "grid" ? "grid grid-cols-3 gap-2" : layoutVariant === "sidebar" ? "grid grid-cols-[2fr_1fr] gap-2" : "flex flex-col gap-2 max-w-[60%] mx-auto"}>
              <div className="rounded p-2" style={{ backgroundColor: themeId === "minimal" ? "#f8fafc" : "rgba(255,255,255,0.05)", border: themeId === "minimal" ? "1px solid #e2e8f0" : "1px solid rgba(148,163,184,0.15)" }}>
                <div className="h-2 w-12 rounded" style={{ backgroundColor: themeId === "minimal" ? "#334155" : "#f1f5f9" }} />
                <div className="mt-1 h-1.5 w-16 rounded" style={{ backgroundColor: themeId === "minimal" ? "#94a3b8" : "#64748b" }} />
              </div>
              <div className="rounded p-2" style={{ backgroundColor: themeId === "minimal" ? "#f8fafc" : "rgba(255,255,255,0.05)", border: themeId === "minimal" ? "1px solid #e2e8f0" : "1px solid rgba(148,163,184,0.15)" }}>
                <div className="h-2 w-10 rounded" style={{ backgroundColor: themeId === "minimal" ? "#334155" : "#f1f5f9" }} />
                <div className="mt-1 h-1.5 w-14 rounded" style={{ backgroundColor: themeId === "minimal" ? "#94a3b8" : "#64748b" }} />
              </div>
              {layoutVariant !== "sidebar" && (
              <div className="rounded p-2" style={{ backgroundColor: themeId === "minimal" ? "#f8fafc" : "rgba(255,255,255,0.05)", border: themeId === "minimal" ? "1px solid #e2e8f0" : "1px solid rgba(148,163,184,0.15)" }}>
                <div className="h-2 w-8 rounded" style={{ backgroundColor: themeId === "minimal" ? "#334155" : "#f1f5f9" }} />
                <div className="mt-1 h-1.5 w-12 rounded" style={{ backgroundColor: themeId === "minimal" ? "#94a3b8" : "#64748b" }} />
              </div>
              )}
            </div>
            {/* Button preview */}
            <div className="mt-3 flex justify-center">
              <div className="h-5 w-20 rounded" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>
    </div>
  );
}
