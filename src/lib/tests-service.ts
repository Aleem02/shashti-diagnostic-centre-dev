import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, limit } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "./firebase";
import { SEED_TESTS, SEED_PROFILES, SEED_GALLERY, type MedicalTest, type GalleryImage, type TestProfile } from "./seed-data";
import { where } from "firebase/firestore";

// In-memory cache to prevent multiple server trips for the same collection in one session
let testsCache: MedicalTest[] | null = null;
let profilesCache: TestProfile[] | null = null;

export async function fetchTests(): Promise<MedicalTest[]> {
  if (testsCache) return testsCache;
  if (!isFirebaseConfigured || !db) return SEED_TESTS;
  
  try {
    const q = query(collection(db, "tests"), limit(150));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MedicalTest, "id">) }));
    
    const dbNames = new Set(items.map(i => i.name.toLowerCase()));
    const uniqueSamples = SEED_TESTS.filter(s => !dbNames.has(s.name.toLowerCase()));
    
    testsCache = [...items, ...uniqueSamples];
    return testsCache;
  } catch (err) {
    console.error("Error fetching tests:", err);
    return SEED_TESTS;
  }
}

export async function addTest(data: Omit<MedicalTest, "id">) {
  if (!db) throw new Error("Firebase not configured");
  testsCache = null; // Invalidate cache
  return addDoc(collection(db, "tests"), data);
}

export async function updateTest(id: string, data: Partial<MedicalTest>) {
  if (!db) throw new Error("Firebase not configured");
  testsCache = null; // Invalidate cache
  return updateDoc(doc(db, "tests", id), data);
}

export async function deleteTest(id: string) {
  if (!db || !storage) throw new Error("Firebase not configured");
  testsCache = null; // Invalidate cache
  
  const docRef = doc(db, "tests", id);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    const data = snap.data();
    if (data.sampleReportUrl && data.sampleReportUrl.includes("firebasestorage")) {
      try {
        const fileRef = ref(storage, data.sampleReportUrl);
        await deleteObject(fileRef);
      } catch (err) {
        console.error("Failed to delete sample report from storage:", err);
      }
    }
  }

  return deleteDoc(docRef);
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  if (!isFirebaseConfigured || !db) return SEED_GALLERY;
  try {
    const q = query(collection(db, "gallery"), limit(50));
    const snap = await getDocs(q);
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
  if (!db || !storage) throw new Error("Firebase not configured");
  
  const docRef = doc(db, "gallery", id);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    const data = snap.data();
    if (data.url && data.url.includes("firebasestorage")) {
      try {
        const fileRef = ref(storage, data.url);
        await deleteObject(fileRef);
      } catch (err) {
        console.error("Failed to delete gallery image from storage:", err);
      }
    }
  }
  
  return deleteDoc(docRef);
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>) {
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, "gallery", id), data);
}

// Test Profiles (Packages)
export async function fetchTestProfiles(): Promise<TestProfile[]> {
  if (profilesCache) return profilesCache;
  if (!isFirebaseConfigured || !db) return SEED_PROFILES;

  try {
    const q = query(collection(db, "test_profiles"), limit(100));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TestProfile, "id">) }));
    
    const dbNames = new Set(items.map(i => i.name.toLowerCase()));
    const uniqueSamples = SEED_PROFILES.filter(s => !dbNames.has(s.name.toLowerCase()));
    
    profilesCache = [...items, ...uniqueSamples];
    return profilesCache;
  } catch (err) {
    console.error("Error fetching test profiles:", err);
    return SEED_PROFILES;
  }
}

export async function addTestProfile(data: Omit<TestProfile, "id">) {
  if (!db) throw new Error("Firebase not configured");
  profilesCache = null; // Invalidate cache
  return addDoc(collection(db, "test_profiles"), data);
}

export async function updateTestProfile(id: string, data: Partial<TestProfile>) {
  if (!db) throw new Error("Firebase not configured");
  profilesCache = null; // Invalidate cache
  return updateDoc(doc(db, "test_profiles", id), data);
}

export async function deleteTestProfile(id: string) {
  if (!db || !storage) throw new Error("Firebase not configured");
  profilesCache = null; // Invalidate cache

  const docRef = doc(db, "test_profiles", id);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    const data = snap.data();
    if (data.sampleReportUrl && data.sampleReportUrl.includes("firebasestorage")) {
      try {
        const fileRef = ref(storage, data.sampleReportUrl);
        await deleteObject(fileRef);
      } catch (err) {
        console.error("Failed to delete profile sample report from storage:", err);
      }
    }
  }
  return deleteDoc(docRef);
}

export async function fetchServiceBySlug(slug: string): Promise<MedicalTest | TestProfile | null> {
  // Try to find in cache first to save a read
  const allTests = testsCache || SEED_TESTS;
  const allProfiles = profilesCache || SEED_PROFILES;
  const inCache = [...allTests, ...allProfiles].find(s => s.slug === slug || s.id === slug);
  if (inCache) return inCache;

  if (!isFirebaseConfigured || !db) return null;

  try {
    // If not in cache, fetch specifically
    const qTest = query(collection(db, "tests"), where("slug", "==", slug), limit(1));
    const snapTest = await getDocs(qTest);
    if (!snapTest.empty) {
      const d = snapTest.docs[0];
      return { id: d.id, ...(d.data() as Omit<MedicalTest, "id">) };
    }

    const qProfile = query(collection(db, "test_profiles"), where("slug", "==", slug), limit(1));
    const snapProfile = await getDocs(qProfile);
    if (!snapProfile.empty) {
      const d = snapProfile.docs[0];
      return { id: d.id, ...(d.data() as Omit<TestProfile, "id">) };
    }

    return null;
  } catch (err) {
    console.error("Error fetching service by slug:", err);
    return null;
  }
}
