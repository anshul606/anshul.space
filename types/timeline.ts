export type TimelineStatus = "ongoing" | "completed";
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";
export type LocationType = "On-site" | "Remote" | "Hybrid";

export interface TimelineEntry {
  id: string;
  role: string; // Job title/role (e.g., "Junior Developer")
  company: string; // Company/organization name
  project?: string; // Optional project name (e.g., "LeadCRM Client Portal Revamp")
  employmentType: EmploymentType; // Full-time, Part-time, etc.
  locationType: LocationType; // On-site, Remote, Hybrid
  location: string; // City, State, Country (e.g., "Jaipur, Rajasthan, India")
  description: string; // What you did there
  startDate: string; // ISO 8601 format: "2025-06-01T00:00:00.000Z"
  endDate?: string; // ISO 8601 format, undefined for ongoing
  logoUrl?: string; // Company logo URL or SVG code
  status: TimelineStatus; // Computed: "ongoing" when no endDate, "completed" when endDate exists
  createdAt: string;
  updatedAt: string;
}

export interface TimelineFormData {
  role: string;
  company: string;
  project?: string;
  employmentType: EmploymentType;
  locationType: LocationType;
  location: string;
  description: string;
  startDate: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format, optional
  logoUrl?: string; // Company logo URL or SVG code
}
