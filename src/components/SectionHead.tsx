import { motion } from "framer-motion";

type Props = {
  index: string;
  kicker: string;
  title: string;
  hint?: string;
};

export default function SectionHead({ index, kicker, title, hint }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5"
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-acid">[{index}]</span>
          <span className="label-mono">{kicker}</span>
        </div>
        <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
          {title}
        </h2>
      </div>
      {hint && (
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">▍ {hint}</span>
      )}
    </motion.div>
  );
}
