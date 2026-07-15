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

export interface GeneralSettings {
  availableForWork: boolean;
  techStack?: { name: string; iconSvg?: string }[];
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  timezone?: string;
}

export async function getGeneralSettings(): Promise<GeneralSettings | null> {
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, "general");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const rawTechStack = data.techStack || [];
      const normalizedTechStack = rawTechStack
        .filter((item: any) => item !== null && item !== undefined)
        .map((item: any) => {
          if (typeof item === "string") {
            return { name: item };
          }
          return item;
        })
        .filter((item: any) => item && typeof item === "object" && typeof item.name === "string");
      return {
        availableForWork: data.availableForWork || false,
        techStack: normalizedTechStack,
        locationName: data.locationName || "Jaipur, India",
        locationLat: typeof data.locationLat === "number" ? data.locationLat : 26.9124,
        locationLng: typeof data.locationLng === "number" ? data.locationLng : 75.7873,
        timezone: data.timezone || "Asia/Kolkata",
      };
    }
    return null;
  } catch (error) {
    console.error("Firestore read error (general settings):", error);
    throw new Error("Failed to fetch general settings");
  }
}

export async function updateGeneralSettings(
  availableForWork: boolean,
  techStack: { name: string; iconSvg?: string }[],
  locationName?: string,
  locationLat?: number,
  locationLng?: number,
  timezone?: string
): Promise<void> {
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, "general");
    await setDoc(docRef, {
      availableForWork,
      techStack,
      locationName: locationName || "Jaipur, India",
      locationLat: typeof locationLat === "number" ? locationLat : 26.9124,
      locationLng: typeof locationLng === "number" ? locationLng : 75.7873,
      timezone: timezone || "Asia/Kolkata",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firestore write error (general settings):", error);
    throw new Error("Failed to update general settings");
  }
}
