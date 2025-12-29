"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project, ProjectFormData } from "@/types/project";
import { useProjects } from "@/context/ProjectContext";
import AdminForm from "@/components/AdminForm";
import AdminProjectList from "@/components/AdminProjectList";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { hasAdminAccess } from "@/lib/admin-access";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check admin access on mount
  useEffect(() => {
    const checkAccess = () => {
      if (hasAdminAccess()) {
        setIsAuthorized(true);
      } else {
        // Redirect to home if not authorized
        router.replace("/");
      }
      setIsCheckingAccess(false);
    };

    checkAccess();
  }, [router]);

  const handleAddClick = () => {
    setEditingProject(null);
    setIsFormVisible(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsFormVisible(false);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await addProject(data);
      }
      setEditingProject(null);
      setIsFormVisible(false);
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
  };

  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render anything if not authorized (will redirect)
  if (!isAuthorized) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
              <p className="text-[#6b7280] mt-1">
                Manage your portfolio projects
              </p>
            </div>
            {!isFormVisible && (
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors"
              >
                Add Project
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form Section */}
          {isFormVisible && (
            <div className="mb-8 p-6 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl">
              <h2 className="text-lg font-medium text-white mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <AdminForm
                key={editingProject?.id ?? "new"}
                project={editingProject}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {/* Projects List */}
          <div>
            <h2 className="text-lg font-medium text-white mb-4">Projects</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="md" message="Loading projects..." />
              </div>
            ) : (
              <AdminProjectList
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
