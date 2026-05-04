import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { SEED_TESTS, SEED_GALLERY, type MedicalTest, type GalleryImage } from "./seed-data";

export async function fetchTests(): Promise<MedicalTest[]> {
  if (!isFirebaseConfigured || !db) return SEED_TESTS;
  try {
    const snap = await getDocs(collection(db, "tests"));
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MedicalTest, "id">) }));
    
    // Merge database items with samples, but remove samples that have been "copied" (same name)
    const dbNames = new Set(items.map(i => i.name.toLowerCase()));
    const uniqueSamples = SEED_TESTS.filter(s => !dbNames.has(s.name.toLowerCase()));
    
    return [...items, ...uniqueSamples];
  } catch {
    return SEED_TESTS;
  }
}

export async function addTest(data: Omit<MedicalTest, "id">) {
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, "tests"), data);
}
export async function updateTest(id: string, data: Partial<MedicalTest>) {
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, "tests", id), data);
}
export async function deleteTest(id: string) {
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, "tests", id));
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  if (!isFirebaseConfigured || !db) return SEED_GALLERY;
  try {
    const snap = await getDocs(collection(db, "gallery"));
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryImage, "id">) }));
    return [...items, ...SEED_GALLERY];
  } catch {
    return SEED_GALLERY;
  }
}
export async function addGalleryImage(data: Omit<GalleryImage, "id">) {
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, "gallery"), data);
}
export async function deleteGalleryImage(id: string) {
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, "gallery", id));
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>) {
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, "gallery", id), data);
}
