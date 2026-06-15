"use client";

import { useState, useEffect } from "react";
import { getResumeConfig, updateResumeConfig } from "@/lib/achievements-firestore";
import { isValidDriveLink, driveShareToEmbed } from "@/lib/drive-utils";

const inputClasses =
  "w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors";
const labelClasses = "block text-sm font-medium text-[#a1a1a1] mb-2";

export default function AdminResumeForm() {
  const [driveLink, setDriveLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const config = await getResumeConfig();
        if (config) {
          setDriveLink(config.driveLink);
        }
      } catch (err) {
        console.error("Failed to fetch resume config:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!driveLink.trim()) {
      setMessage({ type: "error", text: "Please enter a Google Drive link" });
      return;
    }

    if (!isValidDriveLink(driveLink)) {
      setMessage({
        type: "error",
        text: "Invalid Google Drive link. Please use a valid share link.",
      });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await updateResumeConfig(driveLink.trim());
      setMessage({ type: "success", text: "Resume updated successfully!" });
    } catch (err) {
      console.error("Failed to update resume:", err);
      setMessage({ type: "error", text: "Failed to update resume" });
    } finally {
      setIsSaving(false);
    }
  };

  const embedUrl = isValidDriveLink(driveLink)
    ? driveShareToEmbed(driveLink)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-[#6b7280]">Loading resume config...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider mb-4">
          Resume Configuration
        </h3>
        <p className="text-[#6b7280] text-sm mb-6">
          Paste a Google Drive share link to your resume PDF. Make sure the file
          is set to &quot;Anyone with the link&quot; can view.
        </p>
      </div>

      {/* Drive Link Input */}
      <div>
        <label htmlFor="resume-drive-link" className={labelClasses}>
          Google Drive Link *
        </label>
        <input
          type="url"
          id="resume-drive-link"
          value={driveLink}
          onChange={(e) => {
            setDriveLink(e.target.value);
            setMessage(null);
          }}
          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
          className={inputClasses}
          disabled={isSaving}
        />
      </div>

      {/* Preview */}
      {embedUrl && (
        <div>
          <label className={labelClasses}>Preview</label>
          <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#0a0a0a]">
            <iframe
              src={embedUrl}
              className="w-full h-[400px]"
              title="Resume Preview"
            />
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-6 py-3 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Saving..." : "Save Resume Link"}
      </button>
    </div>
  );
}
