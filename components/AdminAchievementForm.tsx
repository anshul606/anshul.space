"use client";

import { useState, FormEvent } from "react";
import { AchievementFormData } from "@/types/achievement";
import { Achievement } from "@/types/achievement";
import { isValidDriveLink, driveShareToDirectImage } from "@/lib/drive-utils";

interface AdminAchievementFormProps {
  achievement?: Achievement | null;
  onSubmit: (data: AchievementFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const inputClasses =
  "w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors";
const labelClasses = "block text-sm font-medium text-[#a1a1a1] mb-2";
const errorClasses = "text-red-500 text-sm mt-1";

function getInitialFormData(
  achievement: Achievement | null | undefined
): AchievementFormData {
  if (achievement) {
    return {
      title: achievement.title,
      issuer: achievement.issuer,
      date: achievement.date || "",
      description: achievement.description || "",
      driveLink: achievement.driveLink || "",
    };
  }
  return {
    title: "",
    issuer: "",
    date: "",
    description: "",
    driveLink: "",
  };
}

export default function AdminAchievementForm({
  achievement,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdminAchievementFormProps) {
  const [formData, setFormData] = useState<AchievementFormData>(() =>
    getInitialFormData(achievement)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!achievement;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.issuer.trim()) errs.issuer = "Issuer is required";
    if (!formData.driveLink.trim()) {
      errs.driveLink = "Certificate image link is required";
    } else if (!isValidDriveLink(formData.driveLink)) {
      errs.driveLink = "Invalid Google Drive link";
    }
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit(formData);
  };

  const previewUrl = isValidDriveLink(formData.driveLink)
    ? driveShareToDirectImage(formData.driveLink)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        {isEditMode ? "Edit Achievement" : "Add New Achievement"}
      </h2>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Certificate Details
        </h3>

        {/* Title */}
        <div>
          <label htmlFor="achievement-title" className={labelClasses}>
            Title *
          </label>
          <input
            type="text"
            id="achievement-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Winner - Inflection Hackathon"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {errors.title && <p className={errorClasses}>{errors.title}</p>}
        </div>

        {/* Issuer */}
        <div>
          <label htmlFor="achievement-issuer" className={labelClasses}>
            Issuer / Organization *
          </label>
          <input
            type="text"
            id="achievement-issuer"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="e.g., GDG On Campus LNMIIT"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {errors.issuer && <p className={errorClasses}>{errors.issuer}</p>}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="achievement-date" className={labelClasses}>
            Date
          </label>
          <input
            type="text"
            id="achievement-date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="e.g., March 2025"
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="achievement-description" className={labelClasses}>
            Description
          </label>
          <textarea
            id="achievement-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description about this achievement..."
            rows={3}
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Certificate Image */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Certificate Image
        </h3>

        <div>
          <label htmlFor="achievement-driveLink" className={labelClasses}>
            Google Drive Link *
          </label>
          <input
            type="url"
            id="achievement-driveLink"
            name="driveLink"
            value={formData.driveLink}
            onChange={handleChange}
            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
            className={inputClasses}
            disabled={isSubmitting}
          />
          <p className="text-[#6b7280] text-xs mt-1">
            Make sure the image is set to &quot;Anyone with the link&quot; can view
          </p>
          {errors.driveLink && (
            <p className={errorClasses}>{errors.driveLink}</p>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div>
            <label className={labelClasses}>Preview</label>
            <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Certificate preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-white/10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Achievement"
            : "Add Achievement"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#2a2a2a] text-white font-medium rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
