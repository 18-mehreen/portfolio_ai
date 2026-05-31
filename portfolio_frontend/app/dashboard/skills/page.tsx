"use client";

import { useState } from "react";
import SkillsManager, { type Skill } from "@/app/dashboard/components/SkillsManager";
import SkillForm from "@/app/dashboard/components/SkillForm";

type ViewMode = "list" | "form";

export default function SkillsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  function handleAdd() {
    setEditingSkill(null);
    setViewMode("form");
  }

  function handleEdit(skill: Skill) {
    setEditingSkill(skill);
    setViewMode("form");
  }

  function handleSuccess() {
    setEditingSkill(null);
    setViewMode("list");
  }

  function handleCancel() {
    setEditingSkill(null);
    setViewMode("list");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {viewMode === "list" ? (
        <SkillsManager onAdd={handleAdd} onEdit={handleEdit} />
      ) : (
        <SkillForm
          skill={editingSkill}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
