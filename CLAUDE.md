# CLAUDE.md — TMTS Landing

Single-page landing for the **TMTS** crew (founded 2014). Sections: roster, gallery,
Taça Guaraná, time-capsule shuffle deck, videos. Copy is **PT-BR**. Aesthetic:
**modern dark esports** — angular HUD cards, CRT scanlines, acid-green accent on
deep slate.

## Stack

- **Vite + React 18 + TypeScript** (strict; `noUnusedLocals`/`noUnusedParameters` on)
- **Tailwind CSS 3** with a custom theme (`tailwind.config.js`)
- **Framer Motion** — parallax, scroll reveals, the shuffle deck flip
- **sharp + heic-convert** — image pipeline (`scripts/build-media.mjs`)
- Deploy: **Netlify** (`netlify.toml`)

## Commands

```bash
npm install
npm run media     # REQUIRED before first dev/build — see below
npm run dev       # vite, http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview
```

`npm run media` is **mandatory before the first `dev`/`build`**. It converts
`assets/` (incl. `.HEIC` the browser can't open) to `.webp` in two sizes
(full + `.thumb`) under `public/media/`, copies the logo, and writes
`src/data/media.json` — the manifest the whole UI reads. Re-run it whenever
photos or members change.

## Project structure

```
assets/                 source photos (gitignored input to the pipeline)
  people/<member>/       one folder per member; folder name = member slug
  group/                 squad photos -> Gallery
  taca-guarana/          Taça photos
scripts/build-media.mjs  image pipeline -> public/media + src/data/media.json
public/media/            generated webp output (do NOT hand-edit)
src/
  App.tsx                boot screen + section composition order
  components/            one file per section + shared pieces
  data/
    content.ts           MEMBER_META — hand-authored per-member flavor (placeholder)
    media.json           GENERATED manifest — never edit by hand
  lib/
    media.ts             manifest accessor, derived counts, pullRandom (Fisher-Yates)
    hooks.ts             useScrollLock etc.
  types.ts               Photo / Member / MediaManifest
  index.css              Tailwind layers + HUD component classes
```

**Data flow:** photos come only from the manifest via `src/lib/media.ts`
(`media`, `allPhotos`, `memberCount`, `photoCount`, `yearsActive`). Don't
hardcode counts or image paths in components — derive from the lib.
Per-member text (number/classe/tagline) lives in `MEMBER_META`; missing keys
fall back to `FALLBACK_META`.

## Design system — follow this

The whole look is intentional. Match it; don't introduce a second visual language.

**Colors** (Tailwind tokens, defined in `tailwind.config.js`):
- `ink-900..500` — slate backgrounds, dark to lighter (`#070809` is the base)
- `acid` (`#c6f73a`, with `acid-400`/`acid-600`) — the ONE accent. CTAs, active
  state, labels, focus highlights. Use sparingly so it stays loud.
- `ember` (`#ff5a3c`) — reserved secondary, used rarely
- text: `zinc-100` body, `zinc-400/500` muted, `ink-900` on acid fills

**Type:**
- `font-display` = **Archivo** (400/600/800/900). Headlines are `font-black
  uppercase tracking-tight`, often huge/`leading-none`.
- `font-mono` = **Space Mono**. Labels, kickers, meta, taglines — usually
  `uppercase` + wide tracking (`tracking-widest` / `tracking-ultra` = 0.35em).
- Helper class `.label-mono` = the standard acid mono kicker.

**HUD / shape language** (component classes in `src/index.css`):
- `.clip-hud`, `.clip-hud-lg`, `.clip-tab` — angular clipped corners. Cards use
  `clip-hud`; buttons/badges use `clip-tab`. This chamfered corner is the
  signature — new cards/buttons should use it.
- `.edge-frame` — inset double border for that paneled look
- `.grid-bg` — faint blueprint grid background
- `.scanlines` + `.noise` — CRT overlays (low opacity, `pointer-events-none`)
- `.text-stroke` — acid outlined hollow text
- corner brackets (see `Hero.tsx`) frame hero/feature areas

**Motion:**
- Reveal pattern: `initial={{opacity:0, y:20-24}}` → `whileInView` with
  `viewport={{ once: true, margin: "-60px"/"-80px" }}`, ~0.45–0.5s.
- Stagger grids with `delay: (index % n) * 0.04`.
- Keyframe animations `scan`, `flicker`, `marquee` are defined in the config.
- **Respect `prefers-reduced-motion`** — `index.css` already kills animations
  and the boot screen is skipped for those users. Keep new motion safe.

**Section pattern:** every section uses `<SectionHead index kicker title hint>`
(numbered `[01]`…`[05]`), wrapped in `section` with an `id` that matches the
`Hud` nav anchors (`topo`, `esquadrao`, `galeria`, `taca`, `capsula`, `videos`).
Standard container: `mx-auto max-w-7xl px-4 sm:px-8` + `py-20 sm:py-28`.

## Conventions

- Components: one default-exported component per file, PascalCase filename.
- Tailwind only — no CSS modules / styled-components. Shared visual primitives
  go in the `@layer components` block in `index.css`, not inline duplication.
- Images: `loading="lazy"` everywhere except the hero (`fetchPriority="high"`).
  Thumbs (`.thumb`) for grids, full `src` for lightbox/feature.
- Keep copy PT-BR and on-voice (gamer/esports, slightly irreverent).
- New section = add `id`, register it in `Hud` `LINKS` + the IntersectionObserver
  id list, and give it a `SectionHead` index.

## Shuffle deck rarity (Cápsula)

The shuffle deck (`ShuffleDeck.tsx`) tags each pull with a tier. Default tier is
**scarcity-based**: the fewer photos a photo's origin contributes to the archive,
the rarer it pulls (`COMUM` → `RARO` → `ÉPICO` → `LENDÁRIO`). Two ways to **force**
a tier, bypassing scarcity:

- `assets/people/legendary-cards/` → **MÍTICO** (`legendary` flag). Rarest pull;
  fires the confetti burst on reveal.
- `assets/people/group/` tier subfolders, mapped in `GROUP_TIERS` in
  `build-media.mjs` → the manifest's per-photo `tier` field:
  - `group/group-mitico/` → **MÍTICO** (also fires confetti)
  - `group/group-epic/` → **ÉPICO**
  - `group/group-rare/` → **RARO**
  - loose files directly in `group/` stay scarcity-tiered.

To add a forced tier: drop photos in the matching subfolder and `npm run media`.
New tier folders go in `GROUP_TIERS`; new tier styles/labels in `TIERS` in
`ShuffleDeck.tsx`. Confetti triggers whenever the resolved label is `MÍTICO`.

## Placeholders to fill (not bugs)

- `MEMBER_META` in `content.ts` — numbers/classes/taglines are scaffolding.
- Taça Guaraná ranking — section has reserved space for champions.
