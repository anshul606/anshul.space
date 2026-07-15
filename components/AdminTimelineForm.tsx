"use client";

import { useState, FormEvent } from "react";
import {
  TimelineEntry,
  TimelineFormData,
  TimelineStatus,
} from "@/types/timeline";
import {
  validateTimelineForm,
  hasTimelineValidationErrors,
  TimelineValidationErrors,
} from "@/lib/validation";

interface AdminTimelineFormProps {
  entry?: TimelineEntry | null;
  onSubmit: (data: TimelineFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface StatusBadgeProps {
  status: TimelineStatus;
}

function TimelineStatusBadge({ status }: StatusBadgeProps) {
  const config = {
    ongoing: {
      label: "Ongoing",
      dotColor: "bg-green-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      borderColor: "border-green-500/20",
    },
    completed: {
      label: "Completed",
      dotColor: "bg-blue-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
  };

  const styles = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${styles.bgColor} ${styles.textColor} ${styles.borderColor} uppercase tracking-wider`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} />
      {styles.label}
    </span>
  );
}

function getInitialFormData(
  entry: TimelineEntry | null | undefined,
): TimelineFormData {
  if (entry) {
    return {
      role: entry.role,
      company: entry.company,
      project: entry.project || "",
      employmentType: entry.employmentType,
      locationType: entry.locationType,
      location: entry.location,
      description: entry.description,
      startDate: entry.startDate ? entry.startDate.split("T")[0] : "", // Convert ISO to date input format
      endDate: entry.endDate ? entry.endDate.split("T")[0] : "", // Convert ISO to date input format
      logoUrl: entry.logoUrl || "",
    };
  }
  return {
    role: "",
    company: "",
    project: "",
    employmentType: "Full-time",
    locationType: "On-site",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    logoUrl: "",
  };
}

export default function AdminTimelineForm({
  entry,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdminTimelineFormProps) {
  const [formData, setFormData] = useState<TimelineFormData>(() =>
    getInitialFormData(entry),
  );
  const [errors, setErrors] = useState<TimelineValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isEditMode = !!entry;

  // Compute status based on endDate
  const computedStatus = formData.endDate ? "completed" : "ongoing";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof TimelineValidationErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof TimelineValidationErrors];
        return newErrors;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validationErrors = validateTimelineForm(formData);
    if (validationErrors[name as keyof TimelineValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name as keyof TimelineValidationErrors],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTimelineForm(formData);
    setErrors(validationErrors);

    setTouched({
      role: true,
      company: true,
      employmentType: true,
      locationType: true,
      location: true,
      description: true,
      startDate: true,
    });

    if (hasTimelineValidationErrors(validationErrors)) {
      return;
    }

    // Convert date inputs to ISO 8601 format before submitting
    const submissionData: TimelineFormData = {
      role: formData.role,
      company: formData.company,
      project: formData.project || undefined,
      employmentType: formData.employmentType,
      locationType: formData.locationType,
      location: formData.location,
      description: formData.description,
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : "",
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : undefined,
      logoUrl: formData.logoUrl || undefined,
    };

    await onSubmit(submissionData);
  };

  const handleCancel = () => {
    setFormData(getInitialFormData(null));
    setErrors({});
    setTouched({});
    onCancel();
  };

  const inputClasses =
    "w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors";
  const labelClasses = "block text-sm font-medium text-[#a1a1a1] mb-2";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        {isEditMode ? "Edit Timeline Entry" : "Add New Timeline Entry"}
      </h2>

      {/* Company & Role Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Position Details
        </h3>

        {/* Role */}
        <div>
          <label htmlFor="role" className={labelClasses}>
            Role / Position Title *
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Junior Developer"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.role && errors.role && (
            <p className={errorClasses}>{errors.role}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className={labelClasses}>
            Company / Organization *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Google Developer Groups on Campus - LNMIIT"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.company && errors.company && (
            <p className={errorClasses}>{errors.company}</p>
          )}
        </div>

        {/* Project (Optional) */}
        <div>
          <label htmlFor="project" className={labelClasses}>
            Project (Optional)
          </label>
          <input
            type="text"
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="LeadCRM Client Portal Revamp"
            className={inputClasses}
            disabled={isSubmitting}
          />
          <p className="text-xs text-[#6b7280] mt-1">
            Specify if this role was for a particular project
          </p>
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className={labelClasses}>
            Employment Type *
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            disabled={isSubmitting}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
          {touched.employmentType && errors.employmentType && (
            <p className={errorClasses}>{errors.employmentType}</p>
          )}
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Location
        </h3>

        {/* Location Type */}
        <div>
          <label htmlFor="locationType" className={labelClasses}>
            Location Type *
          </label>
          <select
            id="locationType"
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            disabled={isSubmitting}
          >
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {touched.locationType && errors.locationType && (
            <p className={errorClasses}>{errors.locationType}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className={labelClasses}>
            Location (City, State, Country) *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jaipur, Rajasthan, India"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.location && errors.location && (
            <p className={errorClasses}>{errors.location}</p>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Description
        </h3>

        <div>
          <label htmlFor="description" className={labelClasses}>
            Role Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe your responsibilities, achievements, and key projects..."
            rows={4}
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.description && errors.description && (
            <p className={errorClasses}>{errors.description}</p>
          )}
        </div>
      </div>

      {/* Date Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Timeline
        </h3>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className={labelClasses}>
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.startDate && errors.startDate && (
            <p className={errorClasses}>{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className={labelClasses}>
            End Date (Optional)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            disabled={isSubmitting}
          />
          <p className="text-xs text-[#6b7280] mt-1">
            Leave empty for current positions
          </p>
        </div>

        {/* Status Badge Display */}
        <div>
          <label className={labelClasses}>Status (Computed)</label>
          <div className="flex items-center gap-2">
            <TimelineStatusBadge status={computedStatus} />
            <span className="text-xs text-[#6b7280]">
              {computedStatus === "ongoing"
                ? "Currently working here"
                : "Past position"}
            </span>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Company Logo (Optional)
        </h3>

        <div>
          <label htmlFor="logoUrl" className={labelClasses}>
            Logo URL or SVG Code
          </label>
          <textarea
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com/logo.svg or paste SVG code"
            rows={3}
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.logoUrl && errors.logoUrl && (
            <p className={errorClasses}>{errors.logoUrl}</p>
          )}
          <p className="text-xs text-[#6b7280] mt-1">
            Paste a URL or inline SVG code. Logo will be converted to grayscale.
          </p>
        </div>
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
              ? "Update Entry"
              : "Add Entry"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#2a2a2a] text-white font-medium rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
