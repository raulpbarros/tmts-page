# TMTS // EST.2014 — landing

Landing page da rapaziada TMTS. Galeria, vídeos, Taça Guaraná e a Cápsula do Tempo
(baralho de memórias aleatórias). Visual: *modern dark esports* — cartões
angulares, HUD, acento ácido sobre slate escuro. Copy em PT-BR.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (tema custom: `ink`, `acid`, `ember`)
- **Framer Motion** (parallax, reveals, baralho)
- **sharp + heic-convert** (pipeline de imagens)

## Como rodar

```bash
npm install
npm run media     # converte assets/ -> public/media + gera src/data/media.json
npm run dev       # http://localhost:5173
```

`npm run media` é **obrigatório antes do primeiro `dev`/`build`** — ele converte
os `.HEIC` (que o browser não abre) e todas as fotos para `.webp` em dois
tamanhos (full + thumb), copia o logo e monta o manifesto que a UI consome.

## Build / deploy (Netlify)

Já tem `netlify.toml` pronto:

```toml
command = "npm run media && npm run build"
publish = "dist"
```

É só conectar o repo no Netlify — ele roda o pipeline e publica `dist/`.
Local:

```bash
npm run build
npm run preview
```

## Estrutura dos assets

```
assets/
  tmts-logo-png.png
  people/
    <membro>/        # 12 membros — nome do membro = nome da pasta
    group/           # fotos do esquadrão -> Galeria
    taca-guarana/    # fotos da Taça
```

Adicionar foto = jogar o arquivo (jpg/png/heic) na pasta certa e rodar
`npm run media`. Novo membro = nova pasta em `people/`.

## O que falta preencher (placeholders)

- **Bios dos integrantes** — `src/data/content.ts` (`MEMBER_META`): número,
  classe e tagline de cada um são provisórios. Edita à vontade.
- **Ranking da Taça Guaraná** — seção tem espaço reservado pros campeões.
