import { useEffect, useState } from "react";
import Tomato from "./Tomato";

const LINKS = [
  { id: "esquadrao", label: "Esquadrão" },
  { id: "galeria", label: "Galeria" },
  { id: "taca", label: "Taça" },
  { id: "capsula", label: "Cápsula" },
  { id: "videos", label: "Vídeos" },
  { id: "rocket", label: "Rocket" },
];

export default function Hud() {
  const [active, setActive] = useState("topo");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = ["topo", ...LINKS.map((l) => l.id)];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[500]">
      <div className="border-b border-white/10 bg-ink-900/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => jump("topo")}
            className="group flex items-center gap-3"
            aria-label="TMTS — topo"
          >
            <Tomato
              alt="TMTS"
              className="h-9 w-9 -rotate-6 transition-transform duration-500 group-hover:rotate-[354deg]"
            />
            <span className="font-display text-lg font-black tracking-tight text-zinc-100 group-hover:text-acid transition-colors">
              TMTS
            </span>
            <span className="hidden font-mono text-[10px] text-zinc-500 sm:inline">EST.2014</span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => jump(l.id)}
                  className={`px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                    active === l.id ? "text-acid" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {active === l.id && <span className="mr-1 text-acid">▍</span>}
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => jump("capsula")}
            className="hidden bg-acid px-4 py-2 font-display text-xs font-extrabold uppercase tracking-widest text-ink-900 hover:bg-acid-400 transition-colors clip-tab sm:block"
          >
            Puxar memória
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 font-mono text-acid md:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? "✕" : "≡"}
          </button>
        </nav>
      </div>

      {open && (
        <div className="border-b border-white/10 bg-ink-800/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => jump(l.id)}
                  className={`w-full border-b border-white/5 py-3 text-left font-mono text-sm uppercase tracking-widest ${
                    active === l.id ? "text-acid" : "text-zinc-300"
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
