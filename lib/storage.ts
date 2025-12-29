import { Project } from "@/types/project";
import { seedProjects } from "./seed";

const STORAGE_KEY = "portfolio-projects";

/**
 * Validates that an object has the required Project structure
 */
function isValidProject(obj: unknown): obj is Project {
  if (typeof obj !== "object" || obj === null) return false;

  const project = obj as Record<string, unknown>;

  return (
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    typeof project.description === "string" &&
    typeof project.websiteUrl === "string" &&
    typeof project.imageUrl === "string" &&
    typeof project.faviconUrl === "string" &&
    (project.status === "live" ||
      project.status === "wip" ||
      project.status === "archived") &&
    typeof project.createdAt === "string" &&
    typeof project.updatedAt === "string"
  );
}

/**
 * Retrieves projects from localStorage.
 * Returns seed data if localStorage is empty or contains invalid data.
 */
export function getProjects(): Project[] {
  try {
    if (typeof window === "undefined") {
      return seedProjects;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with seed data when localStorage is empty
      saveProjects(seedProjects);
      return seedProjects;
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn("Invalid storage format, resetting to seed");
      saveProjects(seedProjects);
      return seedProjects;
    }

    // Filter out invalid entries
    const validProjects = parsed.filter(isValidProject);
    if (validProjects.length !== parsed.length) {
      console.warn("Some invalid project entries were filtered out");
    }

    return validProjects;
  } catch (error) {
    console.error("Storage read error:", error);
    return seedProjects;
  }
}

/**
 * Saves projects to localStorage.
 * Returns true on success, false on failure.
 * Throws an error if storage quota is exceeded.
 */
export function saveProjects(projects: Project[]): boolean {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded");
    }
    console.error("Storage write error:", error);
    return false;
  }
}

/**
 * Clears all project data from localStorage.
 */
export function clearStorage(): void {
  try {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Storage clear error:", error);
  }
}
