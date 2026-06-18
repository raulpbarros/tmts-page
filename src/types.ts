export type Photo = {
  id: string;
  src: string;
  thumb: string;
  w: number;
  h: number;
  source: string;
  // Explicit shuffle-deck rarity override (e.g. group-epic -> "ÉPICO").
  // When absent, rarity is derived from origin scarcity. See ShuffleDeck.
  tier?: string;
};

export type Member = {
  slug: string;
  name: string;
  avatar: string | null;
  photos: Photo[];
};

export type MediaManifest = {
  generatedAt: string;
  estYear: number;
  hero: Photo | null;
  meme: Photo | null;
  rockets: Photo | null;
  members: Member[];
  group: Photo[];
  taca: Photo[];
  legendary: Photo[];
};
