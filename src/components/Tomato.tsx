import type { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  /** Pass a label when the mascot is meaningful (nav/footer). Omit for purely decorative stickers. */
  alt?: string;
};

// The thug-tomato mascot — slapped around the page like a rapaziada sticker.
export default function Tomato({ className = "", style, alt }: Props) {
  const decorative = !alt;
  return (
    <img
      src="/media/logo.webp"
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      draggable={false}
      loading="lazy"
      className={`select-none object-contain ${className}`}
      style={style}
    />
  );
}
