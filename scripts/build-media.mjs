// Asset pipeline: converts HEIC -> webp, optimizes jpg/png/jpeg -> webp at two
// sizes (full + thumb), copies the logo, and emits a typed media manifest the
// React app consumes. Idempotent: skips outputs that already exist and are newer
// than their source. Run with: npm run media
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import heicConvert from "heic-convert";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "assets");
const PEOPLE = path.join(SRC, "people");
const OUT = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "data", "media.json");

const FULL_W = 1600;
const THUMB_W = 640;
const FULL_Q = 80;
const THUMB_Q = 70;

// Folders under people/ that are NOT roster members.
const COLLECTIONS = new Set(["group", "taca-guarana", "legendary-cards"]);
const IMAGE_RE = /\.(heic|jpe?g|png)$/i;

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Display names: literal "capital first letter" per the brief, with a few
// natural-accent overrides for the Brazilian nicknames.
const NAME_OVERRIDES = {
  enzao: "Enzão",
  lucao: "Lucão",
  zepa: "Zepa",
  tusha: "Tusha",
  baioni: "Baioni",
  primo: "Primo",
  deh: "Deh",
};
const displayName = (slug) => NAME_OVERRIDES[slug] ?? titleCase(slug);

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function listImages(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && IMAGE_RE.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

// Returns a sharp instance for any supported source (HEIC decoded via heic-convert).
async function loadSharp(srcPath) {
  if (/\.heic$/i.test(srcPath)) {
    const inputBuffer = await fs.readFile(srcPath);
    const jpgBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 0.92,
    });
    return sharp(jpgBuffer);
  }
  return sharp(srcPath);
}

async function isStale(srcPath, outPath) {
  try {
    const [s, o] = await Promise.all([fs.stat(srcPath), fs.stat(outPath)]);
    return s.mtimeMs > o.mtimeMs;
  } catch {
    return true; // output missing
  }
}

let processed = 0;
let skipped = 0;

// Produces full + thumb webp. Returns { src, thumb, w, h }.
async function processImage(srcPath, outDir, baseName) {
  const fullOut = path.join(outDir, `${baseName}.webp`);
  const thumbOut = path.join(outDir, `${baseName}.thumb.webp`);
  const relFull = path.relative(path.join(ROOT, "public"), fullOut).split(path.sep).join("/");
  const relThumb = path.relative(path.join(ROOT, "public"), thumbOut).split(path.sep).join("/");

  if (!(await isStale(srcPath, fullOut)) && !(await isStale(srcPath, thumbOut))) {
    // Still need dimensions for the manifest.
    const meta = await sharp(fullOut).metadata();
    skipped++;
    return { src: "/" + relFull, thumb: "/" + relThumb, w: meta.width ?? FULL_W, h: meta.height ?? FULL_W };
  }

  const img = (await loadSharp(srcPath)).rotate(); // honor EXIF orientation
  const meta = await img.metadata();

  const full = await img
    .clone()
    .resize({ width: FULL_W, withoutEnlargement: true })
    .webp({ quality: FULL_Q })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(fullOut, full.data);

  const thumb = await img
    .clone()
    .resize({ width: THUMB_W, withoutEnlargement: true })
    .webp({ quality: THUMB_Q })
    .toBuffer();
  await fs.writeFile(thumbOut, thumb);

  processed++;
  const w = full.info.width ?? meta.width ?? FULL_W;
  const h = full.info.height ?? meta.height ?? FULL_W;
  return { src: "/" + relFull, thumb: "/" + relThumb, w, h };
}

async function processFolder(slug) {
  const dir = path.join(PEOPLE, slug);
  const outDir = path.join(OUT, slug);
  await ensureDir(outDir);
  const files = await listImages(dir);
  const photos = [];
  for (let i = 0; i < files.length; i++) {
    const baseName = String(i).padStart(2, "0");
    try {
      const p = await processImage(path.join(dir, files[i]), outDir, baseName);
      photos.push({ id: `${slug}-${i}`, ...p, source: files[i] });
    } catch (err) {
      console.warn(`  ! failed ${slug}/${files[i]}: ${err.message}`);
    }
  }
  return photos;
}

async function copyLogo() {
  const candidates = ["tmts-logo-png.png"];
  for (const c of candidates) {
    const p = path.join(SRC, c);
    try {
      await fs.access(p);
      await sharp(p).png().toFile(path.join(OUT, "logo.png"));
      // a compact webp variant for in-page use
      await sharp(p).resize({ width: 512, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(OUT, "logo.webp"));
      return "/media/logo.png";
    } catch {
      /* keep trying */
    }
  }
  console.warn("  ! logo not found");
  return null;
}

// Standalone hero backdrop, lives at assets root (not a collection folder).
async function processHero() {
  const candidates = ["background-group.HEIC", "background-group.heic"];
  for (const c of candidates) {
    const p = path.join(SRC, c);
    try {
      await fs.access(p);
      const out = await processImage(p, OUT, "hero");
      return { id: "hero", ...out, source: c };
    } catch {
      /* keep trying */
    }
  }
  console.warn("  ! hero background not found");
  return null;
}

// Standalone Wordle meme roasting DEH, lives at assets root (not a collection).
async function processMeme() {
  const candidates = ["deh-brutal.jpg", "deh-brutal.jpeg", "deh-brutal.png"];
  for (const c of candidates) {
    const p = path.join(SRC, c);
    try {
      await fs.access(p);
      const out = await processImage(p, OUT, "meme-deh");
      return { id: "meme-deh", ...out, source: c };
    } catch {
      /* keep trying */
    }
  }
  console.warn("  ! deh meme not found");
  return null;
}

// Standalone Rocket League meme ("rockets"), lives at assets root.
async function processRockets() {
  const candidates = ["rockets.png", "rockets.jpg", "rockets.jpeg", "rockets.heic"];
  for (const c of candidates) {
    const p = path.join(SRC, c);
    try {
      await fs.access(p);
      const out = await processImage(p, OUT, "rockets");
      return { id: "rockets", ...out, source: c };
    } catch {
      /* keep trying */
    }
  }
  console.warn("  ! rockets meme not found");
  return null;
}

async function main() {
  console.log("> TMTS media pipeline");
  await ensureDir(OUT);
  await ensureDir(path.dirname(MANIFEST));

  await copyLogo();

  process.stdout.write("  · hero … ");
  const hero = await processHero();
  console.log(hero ? "ok" : "missing");

  process.stdout.write("  · meme … ");
  const meme = await processMeme();
  console.log(meme ? "ok" : "missing");

  process.stdout.write("  · rockets … ");
  const rockets = await processRockets();
  console.log(rockets ? "ok" : "missing");

  const allSlugs = (await fs.readdir(PEOPLE, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const memberSlugs = allSlugs.filter((s) => !COLLECTIONS.has(s));

  const members = [];
  for (const slug of memberSlugs) {
    process.stdout.write(`  · ${slug} … `);
    const photos = await processFolder(slug);
    members.push({
      slug,
      name: displayName(slug),
      photos,
      avatar: photos[0]?.thumb ?? null,
    });
    console.log(`${photos.length} photo(s)`);
  }

  process.stdout.write("  · group … ");
  const group = await processFolder("group");
  console.log(`${group.length} photo(s)`);

  process.stdout.write("  · taca-guarana … ");
  const taca = await processFolder("taca-guarana");
  console.log(`${taca.length} photo(s)`);

  // Mythic-tier cards for the shuffle deck — rarest pull, triggers a celebration.
  process.stdout.write("  · legendary-cards … ");
  const legendary = await processFolder("legendary-cards");
  console.log(`${legendary.length} photo(s)`);

  const manifest = {
    generatedAt: new Date().toISOString(),
    estYear: 2014,
    hero,
    meme,
    rockets,
    members,
    group,
    taca,
    legendary,
  };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`> done. processed=${processed} skipped=${skipped}`);
  console.log(`> manifest -> ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
