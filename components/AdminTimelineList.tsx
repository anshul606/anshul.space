"use client";

import { useState } from "react";
import { TimelineEntry, TimelineStatus } from "@/types/timeline";

interface AdminTimelineListProps {
  entries: TimelineEntry[];
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

function TimelineStatusBadge({ status }: { status: TimelineStatus }) {
  const config = {
    ongoing: {
      label: "Ongoing",
      dotColor: "bg-green-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
    },
    completed: {
      label: "Completed",
      dotColor: "bg-blue-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
  };

  const styles = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles.bgColor} ${styles.textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} />
      {styles.label}
    </span>
  );
}

export default function AdminTimelineList({
  entries,
  onEdit,
  onDelete,
  isLoading = false,
}: AdminTimelineListProps) {
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

  // Format date for display (e.g., "Jan 2025")
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Format date range for display
  const formatDateRange = (entry: TimelineEntry): string => {
    const start = formatDate(entry.startDate);
    if (entry.endDate) {
      const end = formatDate(entry.endDate);
      return `${start} - ${end}`;
    }
    return `${start} - Present`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06b6d4]"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6b7280]">
          No timeline entries yet. Add your first entry!
        </p>
      </div>
    );
  }

  // Sort entries by startDate DESC
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <>
      <div className="space-y-3">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Timeline Entry Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium truncate">
                    {entry.role}
                  </h3>
                  <TimelineStatusBadge status={entry.status} />
                </div>
                <p className="text-sm text-[#a1a1a1] mb-1">
                  {entry.company} · {entry.employmentType}
                </p>
                {entry.project && (
                  <p className="text-sm text-[#6b7280] mb-1 italic">
                    Project: {entry.project}
                  </p>
                )}
                <p className="text-sm text-[#6b7280] mb-1">
                  {formatDateRange(entry)}
                </p>
                <p className="text-sm text-[#6b7280]">
                  {entry.location} · {entry.locationType}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button
                onClick={() => onEdit(entry)}
                className="px-3 py-1.5 text-sm text-[#a1a1a1] hover:text-white hover:bg-[rgba(255,255,255,0.06)] rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(entry.id)}
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
              Delete Timeline Entry
            </h3>
            <p className="text-[#a1a1a1] mb-6">
              Are you sure you want to delete this timeline entry? This action
              cannot be undone.
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
