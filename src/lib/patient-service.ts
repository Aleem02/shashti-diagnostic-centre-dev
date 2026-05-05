import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  setDoc, 
  getDoc,
  serverTimestamp,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { type PatientUser, type PatientReport } from "./seed-data";

export async function uploadReportToStorage(file: File, phone: string): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not configured");
  
  const cleanPhone = phone.replace(/\s+/g, "");
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const fileRef = ref(storage, `patient_reports/${cleanPhone}/${filename}`);
  
  const metadata = {
    contentType: file.type || 'application/pdf',
  };
  
  await uploadBytes(fileRef, file, metadata);
  return getDownloadURL(fileRef);
}


// Simple SHA-256 hash for PIN
async function hashPin(pin: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(pin);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createOrUpdatePatient(phone: string, pin: string): Promise<"created" | "updated"> {
  if (!db) throw new Error("Firebase not configured");
  const cleanPhone = phone.replace(/\s+/g, "");
  const pinHash = await hashPin(pin);
  const userRef = doc(db, "users", cleanPhone);
  
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    await updateDoc(userRef, { pinHash });
    return "updated";
  } else {
    await setDoc(userRef, {
      phone: cleanPhone,
      pinHash,
      createdAt: serverTimestamp()
    });
    return "created";
  }
}

export async function verifyPatientLogin(phone: string, pin: string): Promise<boolean> {
  if (!db) return false;
  const cleanPhone = phone.replace(/\s+/g, "");
  const userRef = doc(db, "users", cleanPhone);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return false;
  
  const pinHash = await hashPin(pin);
  return userSnap.data().pinHash === pinHash;
}

export async function uploadPatientReport(data: Omit<PatientReport, "id" | "createdAt">) {
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, "reports"), {
    ...data,
    phone: data.phone.replace(/\s+/g, ""),
    createdAt: serverTimestamp()
  });
}


export async function deletePatientReport(id: string) {
  if (!db || !storage) throw new Error("Firebase not configured");
  
  // 1. Fetch the report to get the storage URL
  const reportRef = doc(db, "reports", id);
  const snap = await getDoc(reportRef);
  
  if (snap.exists()) {
    const data = snap.data();
    if (data.reportUrl && data.reportUrl.includes("firebasestorage")) {
      try {
        // 2. Delete the actual file from Firebase Storage
        const fileRef = ref(storage, data.reportUrl);
        await deleteObject(fileRef);
      } catch (err) {
        console.error("Failed to delete file from storage:", err);
        // Continue to delete the DB record even if storage deletion fails (e.g. file already gone)
      }
    }
  }
  
  // 3. Delete the database record
  return deleteDoc(reportRef);
}


export async function fetchPatientReports(phone: string): Promise<PatientReport[]> {
  if (!db) return [];
  const cleanPhone = phone.replace(/\s+/g, "");
  try {
    const q = query(
      collection(db, "reports"),
      where("phone", "==", cleanPhone),
      limit(50)
    );
    const snap = await getDocs(q);
    const reports = snap.docs.map(d => ({ id: d.id, ...d.data() } as PatientReport));
    
    // Sort in memory to avoid needing a composite index in Firestore
    return reports.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    throw err;
  }
}
