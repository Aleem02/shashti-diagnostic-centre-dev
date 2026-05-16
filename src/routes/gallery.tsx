import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchGallery } from "@/lib/tests-service";
import type { GalleryImage } from "@/lib/seed-data";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n.tsx";
import { Breadcrumbs } from "@/components/SEO";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Shashti Diagnostic Center" },
      { name: "description", content: "An editorial look inside our diagnostic gallery — equipment, suites, technicians and community camps." },
      { property: "og:title", content: "Gallery — Shashti Diagnostic" },
      { property: "og:description", content: "Inside the suites, equipment and rituals of Shashti." },
    ],
  }),
  component: GalleryPage,
});

import { motion, AnimatePresence } from "framer-motion";

function GalleryPage() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchGallery().then((g) => { setImages(g); setLoading(false); });
  }, []);
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
      <section className="bg-gradient-warm">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-16 lg:pt-10 lg:pb-20 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Breadcrumbs />
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[8rem] leading-[0.92] tracking-[-0.035em]">
            {t("gallery_tag_1")}<br /><span className="serif-italic">{t("gallery_tag_2")}</span><span className="text-accent">.</span>
          </h1>
          <p className="mt-8 mx-auto lg:mx-0 max-w-xl text-base text-muted-foreground leading-relaxed">
            {t("gallery_page_desc")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 lg:py-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.21, 1, 0.36, 1] }}
                  className="break-inside-avoid"
                >
                  <button
                    onClick={() => setActive(img)}
                    className="group relative w-full overflow-hidden bg-secondary border hairline cursor-pointer rounded-sm shadow-soft hover:shadow-elevated transition-all duration-500"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || "Gallery image"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.2, 1, 0.2, 1) group-hover:scale-110"
                    />
                    {/* Premium Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mb-2">Exhibition · {(i + 1).toString().padStart(3, "0")}</div>
                      {img.caption && (
                        <div className="font-display text-xl text-white tracking-tight leading-tight">
                          {img.caption}
                        </div>
                      )}
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-4 right-4 h-5 w-5 border-r border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {images.length === 0 && (
              <div className="col-span-full py-32 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Gallery is empty</div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Lightbox */}
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
