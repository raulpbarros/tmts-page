import { yearsActive } from "../lib/media";
import Tomato from "./Tomato";

const PLAYLIST_URL =
  "https://www.youtube.com/watch?v=CAGsk-Q21-I&list=PLXAvMX2KFyvA9PfP7_zDeUmP-zdnJBsBe";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <div className="group flex items-center gap-3">
              <Tomato
                alt="TMTS"
                className="h-11 w-11 rotate-3 transition-transform duration-700 group-hover:rotate-[363deg]"
              />
              <span className="font-display text-4xl font-black uppercase tracking-tight">TMTS</span>
            </div>
            <p className="mt-3 max-w-xs font-mono text-xs leading-relaxed text-zinc-500">
              Rapaziada desde 2014. {yearsActive} anos de run, uma Taça Guaraná em jogo e
              um arquivo que só cresce.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-acid"
            >
              ▸ YouTube
            </a>
            <a href="#topo" className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-acid">
              ▴ Voltar ao topo
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:flex-row">
          <span>© {new Date().getFullYear()} TMTS — todos os direitos de zoeira reservados</span>
          <span className="text-acid/60">// EST.2014 — INSERT COIN</span>
        </div>
      </div>
    </footer>
  );
}
