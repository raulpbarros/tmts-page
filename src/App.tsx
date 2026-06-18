import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Hud from "./components/Hud";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Roster from "./components/Roster";
import Gallery from "./components/Gallery";
import Taca from "./components/Taca";
import ShuffleDeck from "./components/ShuffleDeck";
import Videos from "./components/Videos";
import RocketLeague from "./components/RocketLeague";
import WordleCta from "./components/WordleCta";
import Footer from "./components/Footer";
import Tomato from "./components/Tomato";
import { memberCount, photoCount, yearsActive } from "./lib/media";

function Boot({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / 1100) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-ink-900"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="relative text-center">
        <Tomato className="mx-auto mb-5 h-20 w-20 animate-spin-slow drop-shadow-[0_0_30px_rgba(198,247,58,0.25)] sm:h-28 sm:w-28" />
        <div className="font-display text-6xl font-black uppercase tracking-tight text-zinc-100 sm:text-8xl">
          TMTS
        </div>
        <div className="mt-2 font-mono text-xs uppercase tracking-ultra text-acid">
          carregando arquivo // est.2014
        </div>
        <div className="mx-auto mt-6 h-2 w-64 border border-white/15 bg-ink-800">
          <div className="h-full bg-acid transition-[width] duration-75" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 font-mono text-[10px] text-zinc-500">{pct}% — descompactando memórias…</div>
      </div>
    </motion.div>
  );
}

export default function App() {
  // Skip the boot animation synchronously for reduced-motion users (before paint).
  const [booted, setBooted] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  return (
    <>
      <AnimatePresence>{!booted && <Boot onDone={() => setBooted(true)} />}</AnimatePresence>

      <Hud />
      <main>
        <Hero />
        <Marquee
          items={[
            "EST. 2014",
            `${memberCount} NO ESQUADRÃO`,
            "TAÇA GUARANÁ EM DISPUTA",
            `${photoCount} MEMÓRIAS`,
            "INSERT COIN",
            "RUMO AO SSL",
            `${yearsActive} ANOS DE RUN`,
          ]}
        />
        <Roster />
        <Gallery />
        <Taca />
        <ShuffleDeck />
        <Videos />
        <RocketLeague />
        <WordleCta />
      </main>
      <Footer />
    </>
  );
}
