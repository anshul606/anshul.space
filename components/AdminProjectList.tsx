"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { StatusBadge } from "./StatusBadge";

interface AdminProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

function FaviconWithFallback({
  src,
  projectName,
}: {
  src?: string;
  projectName: string;
}) {
  const [hasError, setHasError] = useState(false);
  const initial = projectName.charAt(0).toUpperCase();

  if (!src || hasError) {
    return (
      <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center shrink-0">
        <span className="text-xs text-cyan-500 font-bold">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="w-6 h-6 rounded shrink-0"
      onError={() => setHasError(true)}
    />
  );
}

export default function AdminProjectList({
  projects,
  onEdit,
  onDelete,
  isLoading = false,
}: AdminProjectListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteConfirmId);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06b6d4]"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6b7280]">
          No projects yet. Add your first project!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Favicon with fallback */}
              <FaviconWithFallback
                src={project.faviconUrl}
                projectName={project.name}
              />

              {/* Project Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium truncate">
                    {project.name}
                  </h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-[#6b7280] truncate">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button
                onClick={() => onEdit(project)}
                className="px-3 py-1.5 text-sm text-[#a1a1a1] hover:text-white hover:bg-[rgba(255,255,255,0.06)] rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(project.id)}
                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />

          {/* Dialog */}
          <div className="relative bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Project
            </h3>
            <p className="text-[#a1a1a1] mb-6">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-[#a1a1a1] hover:text-white hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
