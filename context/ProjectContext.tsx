"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Project, ProjectFormData } from "@/types/project";
import {
  getProjects as getFirestoreProjects,
  addProject as addFirestoreProject,
  updateProject as updateFirestoreProject,
  deleteProject as deleteFirestoreProject,
} from "@/lib/firestore";
import { getProjects as getLocalProjects, saveProjects } from "@/lib/storage";

interface ProjectContextValue {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (data: ProjectFormData) => Promise<void>;
  updateProject: (id: string, data: ProjectFormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

interface ProjectProviderProps {
  children: ReactNode;
}

// Check if Firebase is configured
function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFirebase] = useState(isFirebaseConfigured);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useFirebase) {
        const fetchedProjects = await getFirestoreProjects();
        setProjects(fetchedProjects);
      } else {
        // Fallback to localStorage when Firebase is not configured
        const localProjects = getLocalProjects();
        setProjects(localProjects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
      // Fallback to localStorage on Firebase error
      if (useFirebase) {
        try {
          const localProjects = getLocalProjects();
          setProjects(localProjects);
        } catch {
          setProjects([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [useFirebase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback(
    async (data: ProjectFormData) => {
      setError(null);

      try {
        if (useFirebase) {
          const newProject = await addFirestoreProject(data);
          setProjects((prev) => [newProject, ...prev]);
        } else {
          // Fallback to localStorage
          const now = new Date().toISOString();
          const newProject: Project = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          };
          const updated = [newProject, ...projects];
          saveProjects(updated);
          setProjects(updated);
        }
      } catch (err) {
        console.error("Failed to add project:", err);
        setError(err instanceof Error ? err.message : "Failed to add project");
        throw err;
      }
    },
    [useFirebase, projects]
  );

  const updateProject = useCallback(
    async (id: string, data: ProjectFormData) => {
      setError(null);

      try {
        if (useFirebase) {
          await updateFirestoreProject(id, data);
          setProjects((prev) =>
            prev.map((project) =>
              project.id === id
                ? { ...project, ...data, updatedAt: new Date().toISOString() }
                : project
            )
          );
        } else {
          // Fallback to localStorage
          const updated = projects.map((project) =>
            project.id === id
              ? { ...project, ...data, updatedAt: new Date().toISOString() }
              : project
          );
          saveProjects(updated);
          setProjects(updated);
        }
      } catch (err) {
        console.error("Failed to update project:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update project"
        );
        throw err;
      }
    },
    [useFirebase, projects]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      setError(null);

      try {
        if (useFirebase) {
          await deleteFirestoreProject(id);
          setProjects((prev) => prev.filter((project) => project.id !== id));
        } else {
          // Fallback to localStorage
          const updated = projects.filter((project) => project.id !== id);
          saveProjects(updated);
          setProjects(updated);
        }
      } catch (err) {
        console.error("Failed to delete project:", err);
        setError(
          err instanceof Error ? err.message : "Failed to delete project"
        );
        throw err;
      }
    },
    [useFirebase, projects]
  );

  const value: ProjectContextValue = {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjects(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
