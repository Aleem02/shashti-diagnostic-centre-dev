import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchGallery, addGalleryImage, deleteGalleryImage, updateGalleryImage } from "@/lib/tests-service";
import { isFirebaseConfigured, uploadFileToStorage } from "@/lib/firebase";
import type { GalleryImage } from "@/lib/seed-data";
import { Upload, Trash2, Loader2, AlertCircle, Pencil, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState<GalleryImage | null>(null);

  const refresh = () => { setLoading(true); fetchGallery().then((g) => { setImages(g); setLoading(false); }); };
  useEffect(refresh, []);

  const onUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    if (!isFirebaseConfigured) { setError("Configure Firebase to upload."); return; }
    setUploading(true); setError("");
    try {
      for (const file of Array.from(files)) {
        const { url } = await uploadFileToStorage(file, "gallery");
        await addGalleryImage({ url, caption: file.name.replace(/\.[^.]+$/, "") });
      }
      refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try { await deleteGalleryImage(id); refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : "Failed"); }
  };
  const onCaptionUpdate = async (id: string, caption: string) => {
    try { await updateGalleryImage(id, { caption }); }
    catch (e) { console.error("Failed to update caption", e); }
  };

  const currentIndex = images.findIndex((img) => img.id === active?.id);
  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < images.length - 1) setActive(images[currentIndex + 1]);
    else setActive(images[0]);
  };
  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) setActive(images[currentIndex - 1]);
    else setActive(images[images.length - 1]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, currentIndex]);


  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">{images.length} images</p>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload Images"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
        </label>
      </div>

      {!isFirebaseConfigured && (
        <div className="mt-6 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-warning-foreground" />
          <div className="text-warning-foreground">
            <p className="font-semibold">Configuration required</p>
            <p className="text-xs mt-1">Add credentials in <code className="rounded bg-card/60 px-1">src/lib/firebase.ts</code> to enable uploads.</p>
          </div>
        </div>
      )}

      {error && <div className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft flex flex-col h-full">
              <div className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-muted" onClick={() => setActive(img)}>
                <img 
                  src={img.url} 
                  alt={img.caption || ""} 
                  loading="lazy" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <div className="rounded-full bg-white/20 backdrop-blur-md p-3 text-white">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}
                    disabled={!isFirebaseConfigured}
                    className="rounded-full bg-destructive px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground inline-flex items-center gap-1.5 hover:bg-destructive/90 transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2 p-4 cursor-pointer hover:bg-secondary/50 transition-colors mt-auto border-t border-border/50">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  defaultValue={img.caption || ""}
                  onBlur={(e) => onCaptionUpdate(img.id, e.target.value)}
                  placeholder="Add caption..."
                  className="w-full bg-transparent text-[11px] font-bold uppercase tracking-wider focus:outline-none rounded px-1 py-0.5 cursor-pointer text-foreground/80"
                />
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Admin Lightbox */}
      {active && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/95 backdrop-blur p-6" onClick={() => setActive(null)}>
          <button
            onClick={() => setActive(null)}
            className="absolute top-5 right-5 z-[70] rounded-full border border-background/30 p-2.5 text-background hover:bg-background hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={prev}
            className="fixed left-4 lg:left-10 top-1/2 -translate-y-1/2 z-[70] rounded-full bg-background/20 backdrop-blur-xl border border-background/20 p-5 text-background hover:bg-background hover:text-foreground transition-all duration-300 shadow-2xl"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={next}
            className="fixed right-4 lg:right-10 top-1/2 -translate-y-1/2 z-[70] rounded-full bg-background/20 backdrop-blur-xl border border-background/20 p-5 text-background hover:bg-background hover:text-foreground transition-all duration-300 shadow-2xl"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="relative flex flex-col items-center max-w-[90vw] lg:max-w-[75vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.url}
              alt={active.caption || "Preview"}
              className="max-h-[80vh] w-auto object-contain shadow-2xl border-4 border-background/10 rounded-sm"
            />
            {active.caption && (
              <div className="mt-6 text-center font-display text-lg lg:text-2xl text-background tracking-wide">
                {active.caption}
              </div>
            )}
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-background/50">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
