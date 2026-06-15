"use client";

import { useState } from "react";
import { Achievement } from "@/types/achievement";

interface AdminAchievementListProps {
  achievements: Achievement[];
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function AdminAchievementList({
  achievements,
  onEdit,
  onDelete,
  isLoading,
}: AdminAchievementListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-[#6b7280]">Loading achievements...</span>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-12 h-12 text-[#6b7280] mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.852m0 0a6.023 6.023 0 01-2.77-.852"
          />
        </svg>
        <p className="text-[#6b7280]">No achievements added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="flex items-center gap-4 p-4 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl hover:border-[rgba(255,255,255,0.12)] transition-colors"
        >
          {/* Thumbnail */}
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#0a0a0a] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={achievement.imageUrl}
              alt={achievement.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">
              {achievement.title}
            </h3>
            <p className="text-[#6b7280] text-sm truncate">
              {achievement.issuer}
              {achievement.date ? ` · ${achievement.date}` : ""}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(achievement)}
              className="px-3 py-1.5 text-sm text-[#a1a1a1] hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(achievement.id)}
              disabled={deletingId === achievement.id}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                confirmDeleteId === achievement.id
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "text-[#a1a1a1] hover:text-red-400 bg-[#1a1a1a] hover:bg-red-500/10"
              } disabled:opacity-50`}
            >
              {deletingId === achievement.id
                ? "..."
                : confirmDeleteId === achievement.id
                ? "Confirm?"
                : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
