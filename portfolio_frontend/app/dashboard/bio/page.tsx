"use client";

import { useState, useEffect } from "react";
import BioEditor from "@/app/dashboard/components/BioEditor";

export default function BioPage() {
  const [currentBio, setCurrentBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setCurrentBio(data.portfolio?.bio ?? null);
        }
      } catch {
        // Silently fail - BioEditor handles its own errors
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-secondary-200" />
          <div className="h-4 w-2/3 rounded bg-secondary-100" />
          <div className="h-32 rounded bg-secondary-100" />
          <div className="h-40 rounded bg-secondary-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <BioEditor
        currentBio={currentBio}
        onSave={(bio) => setCurrentBio(bio)}
      />
    </div>
  );
}
