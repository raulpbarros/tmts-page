import { useState } from "react";
import SectionHead from "./SectionHead";

const PLAYLIST_ID = "PLXAvMX2KFyvA9PfP7_zDeUmP-zdnJBsBe";
const FIRST_VIDEO = "CAGsk-Q21-I";
const PLAYLIST_URL = `https://www.youtube.com/watch?v=${FIRST_VIDEO}&list=${PLAYLIST_ID}`;

export default function Videos() {
  const [load, setLoad] = useState(false);

  return (
    <section id="videos" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
      <SectionHead index="05" kicker="O canal" title="Vídeos" hint="playlist oficial" />

      <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-ink-700 clip-hud-lg edge-frame">
        {load ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${FIRST_VIDEO}?list=${PLAYLIST_ID}&autoplay=1&rel=0`}
            title="Playlist TMTS"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setLoad(true)} className="group absolute inset-0 h-full w-full" aria-label="Tocar playlist">
            <img
              src={`https://i.ytimg.com/vi/${FIRST_VIDEO}/maxresdefault.jpg`}
              alt="Capa da playlist TMTS"
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
          Tudo que a gente gravou desde 2014, num lugar só. Inscreve, compartilha,
          revive — e cobra os episódios novos.
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
    </section>
  );
}
