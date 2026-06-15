"use client";

import { useState, FormEvent } from "react";
import { Project, ProjectFormData, ProjectStatus } from "@/types/project";
import {
  validateProjectForm,
  hasValidationErrors,
  ValidationErrors,
} from "@/lib/validation";

interface AdminFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getInitialFormData(
  project: Project | null | undefined
): ProjectFormData {
  if (project) {
    return {
      name: project.name,
      slug: project.slug || "",
      description: project.description,
      longDescription: project.longDescription || "",
      websiteUrl: project.websiteUrl,
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl,
      faviconUrl: project.faviconUrl || "",
      techStack: project.techStack || [],
      features: project.features || [],
      status: project.status,
      role: project.role || "",
      year: project.year || "",
      system: project.system || "",
    };
  }
  return {
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    websiteUrl: "",
    githubUrl: "",
    imageUrl: "",
    faviconUrl: "",
    techStack: [],
    features: [],
    status: "wip",
    role: "",
    year: "",
    system: "",
  };
}

export default function AdminForm({
  project,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdminFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(() =>
    getInitialFormData(project)
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const isEditMode = !!project;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from name if not in edit mode
      if (name === "name" && !isEditMode) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validationErrors = validateProjectForm(formData);
    if (validationErrors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name as keyof ValidationErrors],
      }));
    }
  };

  const handleAddTech = () => {
    const items = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !formData.techStack.includes(t));

    if (items.length > 0) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, ...items],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const handleAddFeature = () => {
    const items = featureInput
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f && !formData.features.includes(f));

    if (items.length > 0) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, ...items],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProjectForm(formData);
    setErrors(validationErrors);

    setTouched({
      name: true,
      slug: true,
      description: true,
      websiteUrl: true,
      imageUrl: true,
    });

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    await onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData(getInitialFormData(null));
    setErrors({});
    setTouched({});
    onCancel();
  };

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: "live", label: "Live" },
    { value: "wip", label: "Work in Progress" },
    { value: "archived", label: "Archived" },
  ];

  const inputClasses =
    "w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors";
  const labelClasses = "block text-sm font-medium text-[#a1a1a1] mb-2";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        {isEditMode ? "Edit Project" : "Add New Project"}
      </h2>

      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Basic Info
        </h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="My Awesome Project"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.name && errors.name && (
            <p className={errorClasses}>{errors.name}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelClasses}>
            URL Slug *
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[#6b7280]">/</span>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="my-awesome-project"
              className={inputClasses}
              disabled={isSubmitting}
            />
          </div>
          {touched.slug && errors.slug && (
            <p className={errorClasses}>{errors.slug}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="description" className={labelClasses}>
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="A brief one-liner about your project..."
            rows={2}
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.description && errors.description && (
            <p className={errorClasses}>{errors.description}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label htmlFor="longDescription" className={labelClasses}>
            Full Description
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            placeholder="Detailed description of your project, what it does, why you built it..."
            rows={5}
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className={labelClasses}>
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClasses}
            disabled={isSubmitting}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metadata Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Metadata Specs
        </h3>

        {/* Role */}
        <div>
          <label htmlFor="role" className={labelClasses}>
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            placeholder="e.g., Lead Developer, Systems Engineer"
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className={labelClasses}>
            Year
          </label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year || ""}
            onChange={handleChange}
            placeholder="e.g., 2026, 2025"
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>

        {/* System */}
        <div>
          <label htmlFor="system" className={labelClasses}>
            System / Environment
          </label>
          <input
            type="text"
            id="system"
            name="system"
            value={formData.system || ""}
            onChange={handleChange}
            placeholder="e.g., Web App, Distributed Consensus, Design System"
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Links Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Links
        </h3>

        {/* Website URL */}
        <div>
          <label htmlFor="websiteUrl" className={labelClasses}>
            Website URL *
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.websiteUrl && errors.websiteUrl && (
            <p className={errorClasses}>{errors.websiteUrl}</p>
          )}
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="githubUrl" className={labelClasses}>
            GitHub URL
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Images Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Images
        </h3>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className={labelClasses}>
            Screenshot URL *
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com/screenshot.png"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.imageUrl && errors.imageUrl && (
            <p className={errorClasses}>{errors.imageUrl}</p>
          )}
        </div>

        {/* Favicon URL */}
        <div>
          <label htmlFor="faviconUrl" className={labelClasses}>
            Favicon URL
          </label>
          <input
            type="url"
            id="faviconUrl"
            name="faviconUrl"
            value={formData.faviconUrl}
            onChange={handleChange}
            placeholder="https://example.com/favicon.ico"
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Tech Stack
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTech())
            }
            placeholder="e.g., Next.js, Firebase, Tailwind..."
            className={inputClasses}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={handleAddTech}
            disabled={isSubmitting || !techInput.trim()}
            className="px-4 py-3 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {formData.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white rounded-lg text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="text-[#6b7280] hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider">
          Key Features
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddFeature())
            }
            placeholder="e.g., Real-time sync, Dark mode..."
            className={inputClasses}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={handleAddFeature}
            disabled={isSubmitting || !featureInput.trim()}
            className="px-4 py-3 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {formData.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white rounded-lg text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="text-[#6b7280] hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
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
            ? "Update Project"
            : "Add Project"}
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
