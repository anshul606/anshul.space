"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Project, ProjectFormData } from "@/types/project";
import { Achievement, AchievementFormData } from "@/types/achievement";
import { TimelineEntry, TimelineFormData } from "@/types/timeline";
import { useProjects } from "@/context/ProjectContext";
import {
  getAchievements,
  addAchievement,
  updateAchievement as updateAchievementFirestore,
  deleteAchievement as deleteAchievementFirestore,
} from "@/lib/achievements-firestore";
import {
  getTimelineEntries,
  addTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
} from "@/lib/timeline-firestore";
import AdminForm from "@/components/AdminForm";
import AdminProjectList from "@/components/AdminProjectList";
import AdminResumeForm from "@/components/AdminResumeForm";
import AdminAchievementForm from "@/components/AdminAchievementForm";
import AdminAchievementList from "@/components/AdminAchievementList";
import AdminTimelineForm from "@/components/AdminTimelineForm";
import AdminTimelineList from "@/components/AdminTimelineList";
import AdminSettingsForm from "@/components/AdminSettingsForm";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { hasAdminAccess } from "@/lib/admin-access";

type AdminTab =
  | "projects"
  | "resume"
  | "achievements"
  | "timeline"
  | "settings";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

  // Projects state
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

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementsError, setAchievementsError] = useState<string | null>(
    null,
  );
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [isAchievementFormVisible, setIsAchievementFormVisible] =
    useState(false);
  const [isAchievementSubmitting, setIsAchievementSubmitting] = useState(false);

  // Timeline state
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<TimelineEntry | null>(
    null,
  );
  const [isTimelineFormVisible, setIsTimelineFormVisible] = useState(false);
  const [isTimelineSubmitting, setIsTimelineSubmitting] = useState(false);

  // Check admin access on mount
  useEffect(() => {
    const checkAccess = () => {
      if (hasAdminAccess()) {
        setIsAuthorized(true);
      } else {
        router.replace("/");
      }
      setIsCheckingAccess(false);
    };

    checkAccess();
  }, [router]);

  // Fetch achievements
  const fetchAchievements = useCallback(async () => {
    setAchievementsLoading(true);
    setAchievementsError(null);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (err) {
      console.error("Failed to fetch achievements:", err);
      setAchievementsError(
        err instanceof Error ? err.message : "Failed to fetch achievements",
      );
    } finally {
      setAchievementsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && activeTab === "achievements") {
      fetchAchievements();
    }
  }, [isAuthorized, activeTab, fetchAchievements]);

  // Fetch timeline entries
  const fetchTimelineEntries = useCallback(async () => {
    setTimelineLoading(true);
    setTimelineError(null);
    try {
      const data = await getTimelineEntries();
      setTimelineEntries(data);
    } catch (err) {
      console.error("Failed to fetch timeline entries:", err);
      setTimelineError(
        err instanceof Error ? err.message : "Failed to fetch timeline entries",
      );
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && activeTab === "timeline") {
      fetchTimelineEntries();
    }
  }, [isAuthorized, activeTab, fetchTimelineEntries]);

  // ── Project handlers ─────────────────────────────────────────
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

  // ── Achievement handlers ─────────────────────────────────────
  const handleAddAchievementClick = () => {
    setEditingAchievement(null);
    setIsAchievementFormVisible(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsAchievementFormVisible(true);
  };

  const handleCancelAchievement = () => {
    setEditingAchievement(null);
    setIsAchievementFormVisible(false);
  };

  const handleSubmitAchievement = async (data: AchievementFormData) => {
    setIsAchievementSubmitting(true);
    try {
      if (editingAchievement) {
        await updateAchievementFirestore(editingAchievement.id, data);
      } else {
        await addAchievement(data);
      }
      setEditingAchievement(null);
      setIsAchievementFormVisible(false);
      await fetchAchievements();
    } catch (err) {
      console.error("Failed to save achievement:", err);
    } finally {
      setIsAchievementSubmitting(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    await deleteAchievementFirestore(id);
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  // ── Timeline handlers ────────────────────────────────────────
  const handleAddTimelineClick = () => {
    setEditingTimeline(null);
    setIsTimelineFormVisible(true);
  };

  const handleEditTimeline = (entry: TimelineEntry) => {
    setEditingTimeline(entry);
    setIsTimelineFormVisible(true);
  };

  const handleCancelTimeline = () => {
    setEditingTimeline(null);
    setIsTimelineFormVisible(false);
  };

  const handleSubmitTimeline = async (data: TimelineFormData) => {
    setIsTimelineSubmitting(true);
    try {
      if (editingTimeline) {
        await updateTimelineEntry(editingTimeline.id, data);
      } else {
        await addTimelineEntry(data);
      }
      setEditingTimeline(null);
      setIsTimelineFormVisible(false);
      await fetchTimelineEntries();
    } catch (err) {
      console.error("Failed to save timeline entry:", err);
    } finally {
      setIsTimelineSubmitting(false);
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    await deleteTimelineEntry(id);
    setTimelineEntries((prev) => prev.filter((t) => t.id !== id));
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

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "projects", label: "Projects" },
    { key: "resume", label: "Resume" },
    { key: "achievements", label: "Achievements" },
    { key: "timeline", label: "Timeline" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
              <p className="text-[#6b7280] mt-1">
                Manage your portfolio content
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`admin-tab ${
                  activeTab === tab.key ? "admin-tab-active" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Projects Tab ──────────────────────────────────── */}
          {activeTab === "projects" && (
            <>
              {/* Add Button */}
              <div className="flex justify-end mb-6">
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
                <h2 className="text-lg font-medium text-white mb-4">
                  Projects
                </h2>
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
            </>
          )}

          {/* ── Resume Tab ────────────────────────────────────── */}
          {activeTab === "resume" && (
            <div className="p-6 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl">
              <AdminResumeForm />
            </div>
          )}

          {/* ── Achievements Tab ──────────────────────────────── */}
          {activeTab === "achievements" && (
            <>
              {/* Add Button */}
              <div className="flex justify-end mb-6">
                {!isAchievementFormVisible && (
                  <button
                    onClick={handleAddAchievementClick}
                    className="px-4 py-2 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors"
                  >
                    Add Achievement
                  </button>
                )}
              </div>

              {/* Error */}
              {achievementsError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">{achievementsError}</p>
                </div>
              )}

              {/* Form */}
              {isAchievementFormVisible && (
                <div className="mb-8 p-6 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl">
                  <AdminAchievementForm
                    key={editingAchievement?.id ?? "new"}
                    achievement={editingAchievement}
                    onSubmit={handleSubmitAchievement}
                    onCancel={handleCancelAchievement}
                    isSubmitting={isAchievementSubmitting}
                  />
                </div>
              )}

              {/* List */}
              <div>
                <h2 className="text-lg font-medium text-white mb-4">
                  Achievements
                </h2>
                <AdminAchievementList
                  achievements={achievements}
                  onEdit={handleEditAchievement}
                  onDelete={handleDeleteAchievement}
                  isLoading={achievementsLoading}
                />
              </div>
            </>
          )}

          {/* ── Settings Tab ──────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="p-6 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl">
              <AdminSettingsForm />
            </div>
          )}

          {/* ── Timeline Tab ──────────────────────────────────── */}
          {activeTab === "timeline" && (
            <>
              {/* Add Button */}
              <div className="flex justify-end mb-6">
                {!isTimelineFormVisible && (
                  <button
                    onClick={handleAddTimelineClick}
                    className="px-4 py-2 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors"
                  >
                    Add Timeline Entry
                  </button>
                )}
              </div>

              {/* Error */}
              {timelineError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">{timelineError}</p>
                </div>
              )}

              {/* Form */}
              {isTimelineFormVisible && (
                <div className="mb-8 p-6 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl">
                  <AdminTimelineForm
                    key={editingTimeline?.id ?? "new"}
                    entry={editingTimeline}
                    onSubmit={handleSubmitTimeline}
                    onCancel={handleCancelTimeline}
                    isSubmitting={isTimelineSubmitting}
                  />
                </div>
              )}

              {/* List */}
              <div>
                <h2 className="text-lg font-medium text-white mb-4">
                  Timeline Entries
                </h2>
                <AdminTimelineList
                  entries={timelineEntries}
                  onEdit={handleEditTimeline}
                  onDelete={handleDeleteTimeline}
                  isLoading={timelineLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
