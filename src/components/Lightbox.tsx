import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import type { Photo } from "../types";
import { useScrollLock } from "../lib/hooks";

type Props = {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  caption?: (p: Photo, i: number) => string;
};

export default function Lightbox({ photos, index, onClose, onIndex, caption }: Props) {
  const open = index !== null;
  useScrollLock(open);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + photos.length) % photos.length;
      onIndex(next);
    },
    [index, photos.length, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink-900/92 backdrop-blur-sm p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de imagem"
        >
          <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-white/15 bg-ink-800 font-mono text-acid hover:border-acid hover:bg-acid hover:text-ink-900 transition-colors"
          >
            ✕
          </button>

          <div className="absolute left-4 top-4 z-20 label-mono">
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Anterior"
            className="absolute left-2 sm:left-6 z-20 flex h-12 w-12 items-center justify-center border border-white/10 bg-ink-800/80 text-xl text-zinc-200 hover:border-acid hover:text-acid transition-colors"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Próxima"
            className="absolute right-2 sm:right-6 z-20 flex h-12 w-12 items-center justify-center border border-white/10 bg-ink-800/80 text-xl text-zinc-200 hover:border-acid hover:text-acid transition-colors"
          >
            ›
          </button>

          <motion.figure
            key={photo.id}
            className="relative max-h-full max-w-5xl"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edge-frame clip-hud-lg overflow-hidden bg-ink-800">
              <img
                src={photo.src}
                alt={caption ? caption(photo, index) : "Foto TMTS"}
                className="max-h-[78vh] w-auto object-contain"
                width={photo.w}
                height={photo.h}
              />
            </div>
            {caption && (
              <figcaption className="mt-3 flex items-center justify-between font-mono text-xs text-zinc-400">
                <span className="text-acid">▍</span>
                <span className="truncate">{caption(photo, index)}</span>
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
