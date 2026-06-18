import Tomato from "./Tomato";

type Props = { items: string[]; reverse?: boolean };

export default function Marquee({ items, reverse }: Props) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-acid py-3">
      <div
        className="flex w-max animate-marquee whitespace-nowrap"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((it, i) => (
          <span
            key={i}
            className="mx-6 font-display text-sm font-black uppercase tracking-widest text-ink-900"
          >
            {it}
            <Tomato className={`ml-6 inline-block h-5 w-5 align-middle ${i % 2 ? "-rotate-12" : "rotate-12"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
