import { motion } from "framer-motion";
import { useState } from "react";
import { media } from "../lib/media";
import Lightbox from "./Lightbox";
import SectionHead from "./SectionHead";

const TACA_APP_URL = "https://www.taca.guarana.com.br";

export default function Taca() {
  const photos = media.taca;
  const [light, setLight] = useState<number | null>(null);

  return (
    <section id="taca" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -right-20 top-10 select-none font-display text-[28vw] font-black leading-none text-acid/[0.04]">
        GUARANÁ
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead index="03" kicker="O troféu sagrado" title="Taça Guaraná" hint="disputa eterna" />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-acid/40 bg-acid/5 px-3 py-1">
              <span className="text-acid">🏆︎</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-acid">
                Em disputa desde sempre
              </span>
            </div>
            <p className="mt-5 max-w-lg font-display text-2xl font-extrabold leading-tight text-zinc-100 sm:text-3xl">
              Maior e mais respeitável título do <span className="text-acid">beer pong nacional</span>.
            </p>
            <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-zinc-400">
              Disputado em duplas pela honra e glória de assinar a eterna
              <span className="text-acid"> TAÇA GUARANÁ</span>. Chaveamento e histórico
              completo ficam no app oficial.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { k: "Edições", v: "∞" },
                { k: "Regras", v: "0" },
                { k: "Treta", v: "100%" },
              ].map((s) => (
                <div key={s.k} className="border border-white/10 bg-ink-800 p-3 clip-hud">
                  <div className="font-display text-2xl font-black text-acid">{s.v}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{s.k}</div>
                </div>
              ))}
            </div>
            <a
              href={TACA_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="group mt-7 inline-flex items-center gap-3 bg-acid px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-ink-900 clip-tab transition-colors hover:bg-acid-400"
            >
              <span>🏆︎ Abrir Taça Guaraná</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-4 font-mono text-xs text-zinc-600">
              ▍ ranking dos campeões entra aqui depois — manda os dados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => setLight(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group relative aspect-square overflow-hidden bg-ink-700 clip-hud edge-frame"
              >
                <img
                  src={p.thumb}
                  alt={`Taça Guaraná ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 bg-acid px-2 py-0.5 font-mono text-[10px] text-ink-900">
                  TAÇA_{String(i + 1).padStart(2, "0")}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        photos={photos}
        index={light}
        onClose={() => setLight(null)}
        onIndex={setLight}
        caption={(_p, i) => `Taça Guaraná — registro ${String(i + 1).padStart(2, "0")}`}
      />
    </section>
  );
}
