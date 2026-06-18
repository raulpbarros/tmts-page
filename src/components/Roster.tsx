import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { media } from "../lib/media";
import { MEMBER_META, FALLBACK_META } from "../data/content";
import type { Member } from "../types";
import { useScrollLock } from "../lib/hooks";
import Lightbox from "./Lightbox";
import SectionHead from "./SectionHead";

function MemberCard({ member, index, onOpen }: { member: Member; index: number; onOpen: () => void }) {
  const meta = MEMBER_META[member.slug] ?? FALLBACK_META;
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.04 }}
      className="group relative aspect-[3/4] overflow-hidden bg-ink-700 text-left clip-hud edge-frame"
    >
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={member.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid-bg" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />

      {/* jersey number watermark */}
      <span className="pointer-events-none absolute -right-2 top-1 font-display text-7xl font-black leading-none text-white/5 transition-colors group-hover:text-acid/20">
        {meta.number}
      </span>

      <div className="absolute left-0 top-3">
        <span className="bg-acid px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-900">
          {meta.classe}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="font-display text-xl font-black uppercase leading-none text-zinc-100">
          {member.name}
        </h3>
        <p className="mt-1 line-clamp-1 font-mono text-[10px] text-zinc-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {meta.tagline}
        </p>
        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-acid">
          <span>{member.photos.length} fotos</span>
          <span className="ml-auto translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
            abrir ▸
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const meta = MEMBER_META[member.slug] ?? FALLBACK_META;
  const [light, setLight] = useState<number | null>(null);
  useScrollLock(true);

  return (
    <motion.div
      className="fixed inset-0 z-[800] flex items-end justify-center bg-ink-900/85 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-ink-800 clip-hud-lg"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="scanlines pointer-events-none sticky top-0 z-10 opacity-30" />
        <div className="relative flex items-start justify-between gap-4 border-b border-white/10 bg-ink-700 p-5">
          <div className="flex items-center gap-4">
            {member.avatar && (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-16 w-16 object-cover clip-tab edge-frame"
              />
            )}
            <div>
              <div className="label-mono">
                #{meta.number} // {meta.classe}
              </div>
              <h3 className="font-display text-3xl font-black uppercase leading-none">{member.name}</h3>
              <p className="mt-1 font-mono text-xs text-zinc-400">{meta.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 font-mono text-acid hover:bg-acid hover:text-ink-900 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
          {member.photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setLight(i)}
              className="group relative aspect-square overflow-hidden bg-ink-700 clip-hud"
            >
              <img
                src={p.thumb}
                alt={`${member.name} ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <span className="absolute right-1 top-1 bg-ink-900/70 px-1 font-mono text-[9px] text-acid">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <div onClick={(e) => e.stopPropagation()}>
        <Lightbox
          photos={member.photos}
          index={light}
          onClose={() => setLight(null)}
          onIndex={setLight}
          caption={(_p, i) => `${member.name} — ${String(i + 1).padStart(2, "0")}/${member.photos.length}`}
        />
      </div>
    </motion.div>
  );
}

export default function Roster() {
  const [open, setOpen] = useState<Member | null>(null);

  return (
    <section id="esquadrao" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
      <SectionHead index="01" kicker="O esquadrão" title="A escalação" hint={`${media.members.length} jogadores`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {media.members.map((m, i) => (
          <MemberCard key={m.slug} member={m} index={i} onOpen={() => setOpen(m)} />
        ))}
      </div>

      <p className="mt-6 font-mono text-xs text-zinc-500">
        ▍ bios completas chegando — por enquanto, clica e vê o arquivo de cada um.
      </p>

      <AnimatePresence>{open && <MemberModal member={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
