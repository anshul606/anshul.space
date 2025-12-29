import { ProjectFormData } from "@/types/project";

export interface ValidationErrors {
  name?: string;
  slug?: string;
  description?: string;
  websiteUrl?: string;
  imageUrl?: string;
  faviconUrl?: string;
}

/**
 * Validates if a string is a valid URL format.
 * Returns true for valid URLs, false otherwise.
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === "") {
    return true; // Empty URLs are allowed for optional fields
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid slug format.
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Checks if a string is empty or contains only whitespace.
 */
export function isEmptyOrWhitespace(value: string): boolean {
  return !value || value.trim() === "";
}

/**
 * Validates a project form and returns validation errors.
 * Returns an empty object if all validations pass.
 */
export function validateProjectForm(data: ProjectFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required field: name
  if (isEmptyOrWhitespace(data.name)) {
    errors.name = "This field is required";
  }

  // Required field: slug
  if (isEmptyOrWhitespace(data.slug)) {
    errors.slug = "This field is required";
  } else if (!isValidSlug(data.slug)) {
    errors.slug = "Slug must be lowercase letters, numbers, and hyphens only";
  }

  // Required field: description
  if (isEmptyOrWhitespace(data.description)) {
    errors.description = "This field is required";
  }

  // Required field: websiteUrl
  if (isEmptyOrWhitespace(data.websiteUrl)) {
    errors.websiteUrl = "This field is required";
  } else if (!isValidUrl(data.websiteUrl)) {
    errors.websiteUrl = "Please enter a valid URL";
  }

  // Required field: imageUrl
  if (isEmptyOrWhitespace(data.imageUrl)) {
    errors.imageUrl = "This field is required";
  } else if (!isValidUrl(data.imageUrl)) {
    errors.imageUrl = "Please enter a valid URL";
  }

  // Optional field: faviconUrl (validate format if provided)
  if (data.faviconUrl && !isEmptyOrWhitespace(data.faviconUrl)) {
    if (!isValidUrl(data.faviconUrl)) {
      errors.faviconUrl = "Please enter a valid URL";
    }
  }

  return errors;
}

/**
 * Checks if the form has any validation errors.
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
