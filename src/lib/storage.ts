import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param path Optional path in storage (defaults to 'uploads/')
 */
export async function uploadFile(file: File, path = "uploads/"): Promise<{ url: string; path: string }> {
  if (!storage) throw new Error("Firebase Storage is not initialized");

  const storageRef = ref(storage, `${path}${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return { url, path: snapshot.ref.fullPath };
}

/**
 * Note: Firebase Storage doesn't support URL-based transformations like Cloudinary.
 * This function is kept for compatibility but simply returns the URL.
 */
export function getOptimizedUrl(url: string, _width?: number): string {
  return url;
}
