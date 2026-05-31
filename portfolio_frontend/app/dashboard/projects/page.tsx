"use client";

import { useState } from "react";
import ProjectsManager, { type Project } from "@/app/dashboard/components/ProjectsManager";
import ProjectForm from "@/app/dashboard/components/ProjectForm";

type ViewMode = "list" | "form";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  function handleAdd() {
    setEditingProject(null);
    setViewMode("form");
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setViewMode("form");
  }

  function handleSuccess() {
    setEditingProject(null);
    setViewMode("list");
  }

  function handleCancel() {
    setEditingProject(null);
    setViewMode("list");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {viewMode === "list" ? (
        <ProjectsManager onAdd={handleAdd} onEdit={handleEdit} />
      ) : (
        <ProjectForm
          project={editingProject}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
