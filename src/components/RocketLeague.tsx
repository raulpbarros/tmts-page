import { useState } from "react";
import { motion } from "framer-motion";
import SectionHead from "./SectionHead";
import { rockets } from "../lib/media";

const PLAYLIST_ID = "PLXAvMX2KFyvDdaBBcBoxbinIKMyIQ-Kjy";
const FIRST_VIDEO = "SwSpJsZCGsc";
const PLAYLIST_URL = `https://www.youtube.com/watch?v=${FIRST_VIDEO}&list=${PLAYLIST_ID}`;

// Competitive rank ladder. `reached` = where the rapaziada honestly sits today; SSL is
// the target the whole section is chasing ("Em busca do SSL").
const RANKS = ["Bronze", "Prata", "Ouro", "Platina", "Diamante", "Champ", "Grand Champ", "SSL"];
const REACHED = 4; // …somewhere around Diamante, sendo otimista.

export default function RocketLeague() {
  const [load, setLoad] = useState(false);

  return (
    <section id="rocket" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
      <SectionHead index="06" kicker="Modo turbo // 1v1 ao 3v3" title="Rocket League" hint="rumo ao SSL" />

      {/* Signature: the SSL rank-climb ladder */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative mb-12 overflow-hidden bg-ink-800/60 p-5 clip-hud-lg edge-frame sm:p-7"
      >
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative flex items-end justify-between gap-4">
          <span className="label-mono">Escalada ranqueada</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            ▍ checkpoint atual: {RANKS[REACHED]}
          </span>
        </div>

        {/* scrollable on mobile so the full ladder never squishes */}
        <div className="relative mt-7 overflow-x-auto pb-2">
          <ol className="flex min-w-[640px] items-stretch gap-1.5">
            {RANKS.map((rank, i) => {
              const done = i <= REACHED;
              const isTarget = i === RANKS.length - 1;
              const isHere = i === REACHED;
              return (
                <li key={rank} className="relative flex-1">
                  {/* rapaziada position pin */}
                  {isHere && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-acid">
                      ▼ a rapaziada tá aqui
                    </span>
                  )}
                  <div
                    className={[
                      "flex h-16 flex-col items-center justify-center gap-1 border px-1 text-center clip-tab transition-colors",
                      isTarget
                        ? "border-acid bg-acid text-ink-900 shadow-[0_0_24px_rgba(198,247,58,0.35)] animate-flicker"
                        : done
                          ? "border-acid/40 bg-ink-700 text-zinc-100"
                          : "border-white/10 bg-ink-900/60 text-zinc-600",
                    ].join(" ")}
                  >
                    <span
                      className={`font-mono text-[9px] tracking-widest ${
                        isTarget ? "text-ink-900/70" : done ? "text-acid/70" : "text-zinc-600"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[11px] font-extrabold uppercase leading-none tracking-tight sm:text-xs">
                      {rank}
                    </span>
                  </div>
                  {/* boost-trail connector: lit up to the reached rank, dim after */}
                  {i < RANKS.length - 1 && (
                    <span
                      className={`absolute top-1/2 -right-1.5 z-10 h-px w-3 -translate-y-1/2 ${
                        i < REACHED ? "bg-acid" : "bg-white/10"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <p className="relative mt-5 max-w-xl font-mono text-xs leading-relaxed text-zinc-500">
          Faltam {RANKS.length - 1 - REACHED} divisões pro topo. A meta é simples,
          o boost é que some na hora errada.{" "}
          <span className="text-acid">Em busca do SSL.</span>
        </p>
      </motion.div>

      {/* Playlist + meme */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Playlist embed — same lazy-load pattern as Vídeos */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-ink-700 clip-hud-lg edge-frame">
            {load ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${FIRST_VIDEO}?list=${PLAYLIST_ID}&autoplay=1&rel=0`}
                title="Playlist Rocket League TMTS"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                onClick={() => setLoad(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label="Tocar playlist de Rocket League"
              >
                <img
                  src={`https://i.ytimg.com/vi/${FIRST_VIDEO}/maxresdefault.jpg`}
                  alt="Capa da playlist de Rocket League do TMTS"
                  className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${FIRST_VIDEO}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-ink-900/40" />
                <div className="scanlines absolute inset-0 opacity-40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center bg-acid text-3xl text-ink-900 transition-transform group-hover:scale-110 clip-tab">
                    ▶
                  </span>
                  <span className="mt-4 font-mono text-xs uppercase tracking-ultra text-zinc-200">
                    ▍ carregar playlist
                  </span>
                </div>
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-md font-mono text-sm text-zinc-400">
              Bicicleta no ângulo, demo na bola e aquele save impossível. Os melhores
              (e os piores) momentos da rapaziada nos campos de Rocket League.
            </p>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 bg-ink-800 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-widest text-zinc-100 transition-colors hover:border-acid hover:text-acid clip-tab"
            >
              Abrir no YouTube ▸
            </a>
          </div>
        </motion.div>

        {/* The "rockets" meme — Sale Rocketsito */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="clip-hud border border-white/10 bg-ink-900/70 p-3 sm:p-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-1 pb-3">
            <span className="label-mono">Lenda // Rocketsito</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ember/80">
              meme oficial
            </span>
          </div>

          {rockets ? (
            <figure className="mt-3">
              <img
                src={rockets.src}
                width={rockets.w}
                height={rockets.h}
                loading="lazy"
                alt="Meme de Rocket League da rapaziada — Sale Rocketsito"
                className="clip-hud w-full border border-white/10"
              />
              <figcaption className="mt-3 px-1 font-mono text-xs leading-relaxed text-zinc-400">
                <span className="text-acid">Sale Rocketsito?</span>{" "}
                <span className="text-zinc-600">— o grito de guerra antes de cada partida.</span>
              </figcaption>
            </figure>
          ) : (
            <p className="mt-4 px-1 font-mono text-[10px] text-zinc-600">
              meme não encontrado — rode <span className="text-acid">npm run media</span>.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
