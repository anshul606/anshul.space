export type ProjectStatus = "live" | "wip" | "archived";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  websiteUrl: string;
  githubUrl?: string;
  imageUrl: string;
  faviconUrl: string;
  techStack: string[];
  features?: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  websiteUrl: string;
  githubUrl: string;
  imageUrl: string;
  faviconUrl: string;
  techStack: string[];
  features: string[];
  status: ProjectStatus;
}
