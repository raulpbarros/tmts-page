import manifest from "../data/media.json";
import type { MediaManifest, Photo } from "../types";

export const media = manifest as MediaManifest;

// The DEH Wordle meme (assets/deh-brutal.*), processed by the pipeline.
export const meme = media.meme;

// The Rocket League meme (assets/rockets.*), processed by the pipeline.
export const rockets = media.rockets;

// Every photo across the whole archive, tagged with where it came from.
// `legendary` marks the mythic-tier shuffle cards (rarest pull, celebration FX).
// `tier` (from the manifest) forces an explicit rarity, bypassing scarcity.
export type TaggedPhoto = Photo & { origin: string; legendary?: boolean };

export const allPhotos: TaggedPhoto[] = [
  ...media.members.flatMap((m) => m.photos.map((p) => ({ ...p, origin: m.name }))),
  ...media.group.map((p) => ({ ...p, origin: "Esquadrão" })),
  ...media.taca.map((p) => ({ ...p, origin: "Taça Guaraná" })),
  ...media.legendary.map((p) => ({ ...p, origin: "Carta Mítica", legendary: true })),
];

export const memberCount = media.members.length;
export const photoCount = allPhotos.length;
export const yearsActive = new Date().getFullYear() - media.estYear;

// Fisher-Yates pull of n distinct photos (used by the shuffle deck).
export function pullRandom(n: number, exclude: Set<string> = new Set()): TaggedPhoto[] {
  const pool = allPhotos.filter((p) => !exclude.has(p.id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
