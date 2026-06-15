import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Achievement,
  AchievementFormData,
  ResumeConfig,
} from "@/types/achievement";
import { driveShareToDirectImage } from "./drive-utils";

const ACHIEVEMENTS_COLLECTION = "achievements";
const SITE_CONFIG_COLLECTION = "siteConfig";
const RESUME_DOC_ID = "resume";

// ── Achievements CRUD ──────────────────────────────────────────────

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const achievementsRef = collection(db, ACHIEVEMENTS_COLLECTION);
    const q = query(achievementsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Achievement[];
  } catch (error) {
    console.error("Firestore read error (achievements):", error);
    throw new Error("Failed to fetch achievements");
  }
}

export async function addAchievement(
  data: AchievementFormData
): Promise<Achievement> {
  try {
    const now = new Date().toISOString();
    const imageUrl = driveShareToDirectImage(data.driveLink) || "";
    const achievementData = {
      ...data,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(
      collection(db, ACHIEVEMENTS_COLLECTION),
      achievementData
    );
    return { id: docRef.id, ...achievementData };
  } catch (error) {
    console.error("Firestore write error (achievements):", error);
    throw new Error("Failed to add achievement");
  }
}

export async function updateAchievement(
  id: string,
  data: Partial<AchievementFormData>
): Promise<void> {
  try {
    const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Re-derive imageUrl if driveLink changed
    if (data.driveLink) {
      updateData.imageUrl = driveShareToDirectImage(data.driveLink) || "";
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Firestore update error (achievements):", error);
    throw new Error("Failed to update achievement");
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ACHIEVEMENTS_COLLECTION, id));
  } catch (error) {
    console.error("Firestore delete error (achievements):", error);
    throw new Error("Failed to delete achievement");
  }
}

// ── Resume Config ──────────────────────────────────────────────────

export async function getResumeConfig(): Promise<ResumeConfig | null> {
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, RESUME_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ResumeConfig;
    }
    return null;
  } catch (error) {
    console.error("Firestore read error (resume config):", error);
    throw new Error("Failed to fetch resume config");
  }
}

export async function updateResumeConfig(driveLink: string): Promise<void> {
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, RESUME_DOC_ID);
    await setDoc(docRef, {
      driveLink,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firestore write error (resume config):", error);
    throw new Error("Failed to update resume config");
  }
}
