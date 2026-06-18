import { motion } from "framer-motion";
import { meme } from "../lib/media";

const WORDLE_URL = "https://www.nytimes.com/games/wordle/index.html";

export default function WordleCta() {
  return (
    <section className="relative border-t border-white/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative edge-frame clip-hud-lg overflow-hidden bg-ink-800/60 p-6 sm:p-10">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Pitch + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-acid" />
                <span className="label-mono">Ritual diário // Wordle</span>
              </div>

              <h2 className="mt-4 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
                Palavra<span className="text-acid">.</span> Do<span className="text-acid">.</span> Dia
              </h2>

              <p className="mt-5 max-w-md font-mono text-sm leading-relaxed text-zinc-400">
                Todo dia a rapaziada abre o Wordle. Cinco letras, seis tentativas,
                zero misericórdia no grupo.{" "}
                <span className="text-zinc-200">Bora marcar presença antes da meia-noite.</span>
              </p>

              <a
                href={WORDLE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block bg-acid px-7 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-ink-900 transition-transform hover:-translate-y-0.5 clip-tab"
              >
                ▸ Jogar Wordle
              </a>
            </motion.div>

            {/* Meme — DEH vs. Wordle, sem dó */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="clip-hud border border-white/10 bg-ink-900/70 p-3 sm:p-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-1 pb-3">
                <span className="label-mono">Exhibit A // DEH</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ember/80">
                  evidência // grupo
                </span>
              </div>

              {meme ? (
                <figure className="mt-3">
                  <img
                    src={meme.src}
                    width={meme.w}
                    height={meme.h}
                    loading="lazy"
                    alt="Meme zoando o DEH no Wordle"
                    className="clip-hud w-full border border-white/10"
                  />
                  <figcaption className="mt-3 px-1 font-mono text-[10px] leading-relaxed text-zinc-600">
                    * classe "Palavrinha" segue sendo a maior ironia do esquadrão.
                    sequência do DEH: <span className="text-ember/80">0 dias</span>.
                  </figcaption>
                </figure>
              ) : (
                <p className="mt-4 px-1 font-mono text-[10px] text-zinc-600">
                  meme não encontrado — rode <span className="text-acid">npm run media</span>.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
