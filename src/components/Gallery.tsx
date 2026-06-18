import { motion } from "framer-motion";
import { useState } from "react";
import { media } from "../lib/media";
import Lightbox from "./Lightbox";
import SectionHead from "./SectionHead";

export default function Gallery() {
  const photos = media.group;
  const [light, setLight] = useState<number | null>(null);

  return (
    <section id="galeria" className="relative border-t border-white/10 bg-ink-800/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead index="02" kicker="Arquivo do esquadrão" title="A galeria" hint={`${photos.length} registros`} />

        <div className="[column-fill:_balance] gap-3 sm:columns-2 lg:columns-3">
          {photos.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setLight(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="group relative mb-3 block w-full overflow-hidden bg-ink-700 clip-hud edge-frame"
            >
              <img
                src={p.thumb}
                alt={`TMTS arquivo ${i + 1}`}
                loading="lazy"
                width={p.w}
                height={p.h}
                className="w-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-acid/0 transition-colors duration-300 group-hover:bg-acid/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="bg-ink-900/80 px-2 py-0.5 font-mono text-[10px] text-acid">
                  REG_{String(i + 1).padStart(3, "0")}
                </span>
                <span className="bg-acid px-2 py-0.5 font-mono text-[10px] text-ink-900">▢ abrir</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox
        photos={photos}
        index={light}
        onClose={() => setLight(null)}
        onIndex={setLight}
        caption={(_p, i) => `Arquivo do esquadrão — REG_${String(i + 1).padStart(3, "0")}`}
      />
    </section>
  );
}
