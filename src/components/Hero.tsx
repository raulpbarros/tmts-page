import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { media } from "../lib/media";
import { memberCount, photoCount, yearsActive } from "../lib/media";
import Tomato from "./Tomato";

const heroShot = media.hero?.src ?? media.group[0]?.src ?? media.taca[0]?.src ?? "";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-3xl font-black leading-none text-acid sm:text-4xl">{value}</span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* parallax backdrop */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {heroShot && (
          <img
            src={heroShot}
            alt="A rapaziada TMTS reunida"
            className="h-full w-full object-cover opacity-40"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/70 to-ink-900" />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </motion.div>

      {/* giant mascot bleeding off the corner, faint */}
      <Tomato className="pointer-events-none absolute -bottom-20 -right-16 z-0 h-72 w-72 rotate-12 opacity-[0.06] sm:h-[30rem] sm:w-[30rem]" />

      <div className="scanlines pointer-events-none absolute inset-0 opacity-50" />
      {/* HUD corner brackets */}
      <div className="pointer-events-none absolute inset-4 sm:inset-8 z-10">
        <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-acid/70" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-acid/70" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-acid/70" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-acid/70" />
      </div>

      {/* floating sticker, bobbing */}
      <Tomato
        className="pointer-events-none absolute right-6 top-28 z-20 hidden h-28 w-28 animate-bob drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] sm:block lg:right-20 lg:h-44 lg:w-44"
        style={{ ["--tilt" as string]: "-10deg" }}
      />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pt-24 pb-16 sm:px-8"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-acid" />
          <span className="label-mono">Rapaziada // Conteúdo // Resenha infinita</span>
        </div>

        <h1 className="mt-5 font-display font-black uppercase leading-[0.82] tracking-tight">
          <span className="block text-[18vw] sm:text-[15vw] lg:text-[12rem]">TMTS</span>
          <span className="mt-2 block text-2xl text-zinc-300 sm:text-4xl">
            desde <span className="text-acid">2014</span>
          </span>
        </h1>

        <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-zinc-400">
          Doze caras, uma playlist que não para de crescer e uma Taça Guaraná em
          disputa eterna. Isto aqui é o arquivo vivo da nossa run —{" "}
          <span className="text-zinc-200">foto, vídeo e memória</span> em loop.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-8">
          <Stat value={`${yearsActive}`} label="Anos de run" />
          <span className="h-10 w-px bg-white/10" />
          <Stat value={`${memberCount}`} label="No esquadrão" />
          <span className="h-10 w-px bg-white/10" />
          <Stat value={`${photoCount}`} label="Memórias no arquivo" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            onClick={() => document.getElementById("esquadrao")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-acid px-6 py-3 font-display text-sm font-extrabold uppercase tracking-widest text-ink-900 transition-transform hover:-translate-y-0.5 clip-tab"
          >
            Conhecer o esquadrão
          </button>
          <button
            onClick={() => document.getElementById("capsula")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-white/20 px-6 py-3 font-display text-sm font-extrabold uppercase tracking-widest text-zinc-200 transition-colors hover:border-acid hover:text-acid clip-tab"
          >
            Puxar uma memória ▸
          </button>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-ultra text-zinc-500">
        <span className="animate-flicker">▼ role pra baixo</span>
      </div>
    </section>
  );
}
