import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { allPhotos, pullRandom, type TaggedPhoto } from "../lib/media";
import Confetti from "./Confetti";
import Lightbox from "./Lightbox";
import SectionHead from "./SectionHead";

// Rarity is derived from how scarce a photo's origin is in the archive:
// fewer photos from that source => rarer pull. Deterministic per photo.
type Rarity = { label: string; ring: string; text: string; chance: number };

// Tier styling, keyed by label. The MÍTICO tier fires the celebration burst.
const TIERS: Record<string, Rarity> = {
  "MÍTICO": { label: "MÍTICO", ring: "border-amber-300", text: "text-amber-300", chance: 1 },
  "LENDÁRIO": { label: "LENDÁRIO", ring: "border-amber-400", text: "text-amber-400", chance: 4 },
  "ÉPICO": { label: "ÉPICO", ring: "border-fuchsia-400", text: "text-fuchsia-400", chance: 12 },
  "RARO": { label: "RARO", ring: "border-cyan-400", text: "text-cyan-400", chance: 28 },
  "COMUM": { label: "COMUM", ring: "border-acid", text: "text-acid", chance: 56 },
};

function buildRarity(): Map<string, Rarity> {
  const counts = new Map<string, number>();
  allPhotos.forEach((p) => counts.set(p.origin, (counts.get(p.origin) ?? 0) + 1));
  const map = new Map<string, Rarity>();
  allPhotos.forEach((p) => {
    const c = counts.get(p.origin) ?? 1;
    let r: Rarity;
    // Mythic cards (assets/people/legendary-cards) override scarcity-based tiers:
    // always the rarest pull, and they fire the celebration burst on reveal.
    if (p.legendary) r = TIERS["MÍTICO"];
    // Explicit tier from the manifest (group-mitico/-epic/-rare subfolders).
    else if (p.tier && TIERS[p.tier]) r = TIERS[p.tier];
    else if (c <= 2) r = TIERS["LENDÁRIO"];
    else if (c <= 4) r = TIERS["ÉPICO"];
    else if (c <= 7) r = TIERS["RARO"];
    else r = TIERS["COMUM"];
    map.set(p.id, r);
  });
  return map;
}

export default function ShuffleDeck() {
  const rarity = useMemo(buildRarity, []);
  const [current, setCurrent] = useState<TaggedPhoto | null>(null);
  const [history, setHistory] = useState<TaggedPhoto[]>([]);
  const [pulling, setPulling] = useState(false);
  const [light, setLight] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const pull = () => {
    if (pulling) return;
    setPulling(true);
    const exclude = new Set(history.slice(-6).map((p) => p.id));
    const [next] = pullRandom(1, exclude);
    // brief "shuffling" beat before the reveal
    window.setTimeout(() => {
      setCurrent(next);
      setHistory((h) => [...h, next].slice(-12));
      setPulling(false);
      if (next && rarity.get(next.id)?.label === "MÍTICO") setCelebrating(true); // mythic pull → party
    }, 520);
  };

  const r = current ? rarity.get(current.id) : null;

  return (
    <section id="capsula" className="relative overflow-hidden border-y border-white/10 bg-ink-800/50 py-20 sm:py-28">
      <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead index="04" kicker="Cápsula do tempo" title="Puxa uma memória" hint={`${allPhotos.length} no baralho`} />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* control side */}
          <div>
            <p className="max-w-md font-mono text-sm leading-relaxed text-zinc-400">
              O arquivo inteiro virou baralho. Aperta o botão e o sistema sorteia uma
              memória aleatória — pode vir foto de qualquer um, do esquadrão inteiro ou
              da Taça. Quanto mais rara a origem,{" "}
              <span className="text-acid">mais lendária a carta</span>.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
              {[
                ["COMUM", "text-acid"],
                ["RARO", "text-cyan-400"],
                ["ÉPICO", "text-fuchsia-400"],
                ["LENDÁRIO", "text-amber-400"],
                ["MÍTICO", "text-amber-300"],
              ].map(([l, c]) => (
                <span key={l} className={`border border-white/10 px-2 py-1 ${c}`}>
                  ◆ {l}
                </span>
              ))}
            </div>

            <button
              onClick={pull}
              disabled={pulling}
              className="group mt-8 flex w-full items-center justify-center gap-3 bg-acid px-6 py-4 font-display text-base font-black uppercase tracking-widest text-ink-900 transition-transform hover:-translate-y-0.5 disabled:opacity-70 clip-tab sm:w-auto"
            >
              <span className={pulling ? "animate-spin" : "transition-transform group-hover:rotate-180"}>⟳</span>
              {pulling ? "embaralhando…" : current ? "puxar de novo" : "puxar memória"}
            </button>

            {history.length > 1 && (
              <div className="mt-8">
                <div className="label-mono mb-2">Histórico de puxadas</div>
                <div className="flex flex-wrap gap-2">
                  {history
                    .slice(0, -1)
                    .reverse()
                    .slice(0, 8)
                    .map((p) => (
                      <button
                        key={p.id + Math.random()}
                        onClick={() => setCurrent(p)}
                        className="h-12 w-12 overflow-hidden border border-white/10 hover:border-acid clip-hud"
                      >
                        <img src={p.thumb} alt={p.origin} className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* card stage */}
          <div className="relative flex min-h-[380px] items-center justify-center">
            {/* stacked deck behind */}
            <div className="absolute h-[330px] w-[250px]">
              {[3, 2, 1].map((d) => (
                <div
                  key={d}
                  className="absolute inset-0 border border-white/10 bg-ink-700 clip-hud"
                  style={{ transform: `translate(${d * 7}px, ${d * 7}px) rotate(${d * 2}deg)`, opacity: 0.5 - d * 0.1 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {!current && !pulling && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex h-[330px] w-[250px] flex-col items-center justify-center border border-white/15 bg-ink-700 text-center clip-hud edge-frame"
                >
                  <span className="text-5xl text-acid/60">⊟</span>
                  <p className="mt-4 px-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
                    baralho selado — aperta pra revelar
                  </p>
                </motion.div>
              )}

              {pulling && (
                <motion.div
                  key="shuffling"
                  initial={{ opacity: 0, rotateY: 0 }}
                  animate={{ opacity: 1, rotateY: [0, 180, 360] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex h-[330px] w-[250px] items-center justify-center border-2 border-acid bg-ink-700 clip-hud"
                >
                  <span className="animate-flicker font-mono text-xs uppercase tracking-ultra text-acid">
                    embaralhando…
                  </span>
                </motion.div>
              )}

              {current && !pulling && r && (
                <motion.button
                  key={current.id}
                  onClick={() => setLight(0)}
                  initial={{ rotateY: -90, opacity: 0, y: 20 }}
                  animate={{ rotateY: 0, opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`relative z-10 block h-[330px] w-[250px] overflow-hidden border-2 bg-ink-700 clip-hud edge-frame ${r.ring} ${
                    r.label === "MÍTICO" ? "shadow-[0_0_40px_-4px_rgba(252,211,77,0.7)]" : ""
                  }`}
                >
                  <img src={current.src} alt={current.origin} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/40" />
                  <div className="absolute left-3 top-3">
                    <span className={`border bg-ink-900/80 px-2 py-1 font-mono text-[10px] tracking-widest ${r.ring} ${r.text}`}>
                      ◆ {r.label}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">origem</div>
                    <div className="font-display text-2xl font-black uppercase leading-none text-zinc-100">
                      {current.origin}
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-acid">▢ toca pra ampliar</div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {current && (
        <Lightbox
          photos={[current]}
          index={light}
          onClose={() => setLight(null)}
          onIndex={setLight}
          caption={() => `${current.origin} — memória ${r?.label.toLowerCase() ?? ""}`}
        />
      )}

      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </section>
  );
}
