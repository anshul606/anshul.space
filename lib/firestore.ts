import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, ProjectFormData } from "@/types/project";

const COLLECTION_NAME = "projects";

export async function getProjects(): Promise<Project[]> {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const q = query(projectsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error("Firestore read error:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function addProject(data: ProjectFormData): Promise<Project> {
  try {
    const now = new Date().toISOString();
    const projectData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), projectData);
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error("Firestore write error:", error);
    throw new Error("Failed to add project");
  }
}

export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firestore update error:", error);
    throw new Error("Failed to update project");
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Firestore delete error:", error);
    throw new Error("Failed to delete project");
  }
}
