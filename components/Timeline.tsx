"use client";

import { useState, useEffect } from "react";
import { TimelineEntry } from "@/types/timeline";
import { getTimelineEntries } from "@/lib/timeline-firestore";
import { LoadingSpinner } from "./LoadingSpinner";

export function Timeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const data = await getTimelineEntries();
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load timeline",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  // Format date for display (e.g., "Sep 2025")
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Calculate duration
  const calculateDuration = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    if (months < 1) return "Less than a month";
    if (months === 1) return "1 mo";
    if (months < 12) return `${months} mos`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) return years === 1 ? "1 yr" : `${years} yrs`;
    return `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`;
  };

  // Format date range
  const formatDateRange = (entry: TimelineEntry): string => {
    const start = formatDate(entry.startDate);
    const end = entry.endDate ? formatDate(entry.endDate) : "Present";
    const duration = calculateDuration(entry.startDate, entry.endDate);
    return `${start} - ${end} · ${duration}`;
  };

  // Convert SVG to grayscale using CSS filter
  const renderLogo = (entry: TimelineEntry) => {
    if (!entry.logoUrl) return null;

    // Check if it's SVG code or URL
    const isSvgCode = entry.logoUrl.includes("<svg");

    if (isSvgCode) {
      return (
        <div
          className="w-12 h-12 shrink-0 flex items-center justify-center filter grayscale"
          dangerouslySetInnerHTML={{ __html: entry.logoUrl }}
        />
      );
    }

    return (
      <img
        src={entry.logoUrl}
        alt={`${entry.company} logo`}
        className="w-12 h-12 object-contain filter grayscale"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 border-t border-white/8 flex items-center justify-center bg-white/[0.005]">
        <LoadingSpinner size="sm" message="Loading timeline..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border-t border-white/8 bg-white/[0.005]">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-8 border-t border-white/8 bg-white/[0.005]">
        <p className="text-[#6b7280] text-center">No timeline entries yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 border-t border-white/8 bg-white/[0.005]">
      {/* Vertical Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/10" />

        {/* Timeline Entries */}
        <div className="space-y-8">
          {entries.map((entry, index) => (
            <div key={entry.id} className="relative flex gap-6">
              {/* Timeline Dot */}
              <div className="relative z-10 shrink-0">
                {entry.logoUrl ? (
                  <div className="w-12 h-12 flex items-center justify-center">
                    {renderLogo(entry)}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/[0.02] border-2 border-white/20 flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${entry.status === "ongoing" ? "bg-green-500" : "bg-[#06b6d4]"}`}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                {/* Role & Status */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {entry.role}
                  </h3>
                  {entry.status === "ongoing" && (
                    <span className="relative flex h-2 w-2 mt-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </div>

                {/* Company & Employment Type */}
                <p className="text-[#a1a1a1] font-medium mb-1">
                  {entry.company} · {entry.employmentType}
                </p>

                {/* Project (if exists) */}
                {entry.project && (
                  <p className="text-[#6b7280] text-sm mb-1 italic">
                    Project: {entry.project}
                  </p>
                )}

                {/* Date Range & Duration */}
                <p className="text-sm text-[#6b7280] mb-2">
                  {formatDateRange(entry)}
                </p>

                {/* Location */}
                <p className="text-sm text-[#6b7280] mb-3">
                  {entry.location} · {entry.locationType}
                </p>

                {/* Description */}
                <p className="text-[#a1a1a1] text-sm leading-relaxed">
                  {entry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
