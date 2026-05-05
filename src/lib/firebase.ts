// Firebase configuration
// Replace the placeholder values below with your Firebase project credentials.
// Get them from: https://console.firebase.google.com/ → Project Settings → Your apps
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isFirebaseConfigured && typeof window !== "undefined") {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  
  // Initialize Firestore with persistent local caching to save on database read costs
  try {
    dbInstance = initializeFirestore(app, {
      localCache: persistentLocalCache()
    });
  } catch (e) {
    // Fallback if somehow already initialized
    dbInstance = getFirestore(app);
  }
  
  storageInstance = getStorage(app);
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

export async function uploadFileToStorage(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  if (!storage) throw new Error("Firebase Storage not configured");
  
  let fileToUpload = file;
  
  // Automatically compress images before upload to save massive amounts of storage and bandwidth costs
  if (file.type.startsWith("image/")) {
    try {
      fileToUpload = await imageCompression(file, {
        maxSizeMB: 0.2, // Aim for 200KB
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: "image/jpeg" // Force JPEG for better compression than PNG
      });
    } catch (err) {
      console.warn("Image compression failed, proceeding with original file:", err);
    }
  }
  
  // Create a safe, unique filename
  const filename = `${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const fileRef = ref(storage, `${folder}/${filename}`);
  
  const metadata = {
    contentType: fileToUpload.type || 'application/octet-stream',
  };
  
  await uploadBytes(fileRef, fileToUpload, metadata);
  const url = await getDownloadURL(fileRef);
  
  // publicId is not strictly needed for Firebase, but we return the path to keep API compatibility
  return { url, publicId: fileRef.fullPath };
}

