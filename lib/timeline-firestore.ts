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
import {
  TimelineEntry,
  TimelineFormData,
  TimelineStatus,
} from "@/types/timeline";

const COLLECTION_NAME = "timeline";

/**
 * Fetch all timeline entries ordered by start date (descending)
 * @returns Promise<TimelineEntry[]> Array of timeline entries
 * @throws Error if fetch fails
 */
export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    const timelineRef = collection(db, COLLECTION_NAME);
    const q = query(timelineRef, orderBy("startDate", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TimelineEntry[];
  } catch (error) {
    console.error("Firestore read error (timeline):", error);
    throw new Error("Failed to fetch timeline entries");
  }
}

/**
 * Add a new timeline entry
 * Status is computed based on endDate: "ongoing" if no endDate, "completed" if endDate exists
 * @param data TimelineFormData with role, company, employment details, and dates
 * @returns Promise<TimelineEntry> The created timeline entry with generated id
 * @throws Error if add fails
 */
export async function addTimelineEntry(
  data: TimelineFormData,
): Promise<TimelineEntry> {
  try {
    const now = new Date().toISOString();

    // Compute status based on endDate presence
    const status: TimelineStatus = data.endDate ? "completed" : "ongoing";

    const entryData: Record<string, unknown> = {
      role: data.role,
      company: data.company,
      employmentType: data.employmentType,
      locationType: data.locationType,
      location: data.location,
      description: data.description,
      startDate: data.startDate,
      status,
      createdAt: now,
      updatedAt: now,
    };

    // Only add optional fields if they exist
    if (data.project) {
      entryData.project = data.project;
    }

    // Only add endDate if it exists (Firestore doesn't accept undefined)
    if (data.endDate) {
      entryData.endDate = data.endDate;
    }

    // Only add logoUrl if it exists
    if (data.logoUrl) {
      entryData.logoUrl = data.logoUrl;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), entryData);
    return { id: docRef.id, ...entryData } as TimelineEntry;
  } catch (error) {
    console.error("Firestore write error (timeline):", error);
    throw new Error("Failed to add timeline entry");
  }
}

/**
 * Update an existing timeline entry
 * Status is recomputed if endDate changes
 * @param id Timeline entry id
 * @param data Partial<TimelineFormData> with fields to update
 * @returns Promise<void>
 * @throws Error if update fails
 */
export async function updateTimelineEntry(
  id: string,
  data: Partial<TimelineFormData>,
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Recompute status if endDate is being updated
    if ("endDate" in data) {
      updateData.status = data.endDate
        ? ("completed" as TimelineStatus)
        : ("ongoing" as TimelineStatus);

      // Only include endDate if it has a value, otherwise omit it
      if (data.endDate) {
        updateData.endDate = data.endDate;
      } else {
        // Remove endDate field from document if it's now empty
        updateData.endDate = null;
      }
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Firestore update error (timeline):", error);
    throw new Error("Failed to update timeline entry");
  }
}

/**
 * Delete a timeline entry
 * @param id Timeline entry id
 * @returns Promise<void>
 * @throws Error if delete fails
 */
export async function deleteTimelineEntry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Firestore delete error (timeline):", error);
    throw new Error("Failed to delete timeline entry");
  }
}
