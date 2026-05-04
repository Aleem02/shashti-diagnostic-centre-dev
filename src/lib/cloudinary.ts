// Cloudinary configuration
// 1. Sign up at https://cloudinary.com
// 2. Create an unsigned upload preset (Settings → Upload → Add upload preset)
// 3. Replace the values below
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = !!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured) throw new Error("Cloudinary not configured");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

export function optimizedImage(url: string, width = 800): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
