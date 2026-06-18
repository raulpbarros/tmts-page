// Per-member flavor metadata that does NOT live in the asset folders.
// Real bios/descriptions land later — these "classe" archetypes, jersey
// numbers and placeholder taglines are scaffolding so the roster reads as an
// intentional esports lineup instead of empty cards. Edit freely.
export type MemberMeta = {
  number: string;
  classe: string;
  tagline: string;
};

export const MEMBER_META: Record<string, MemberMeta> = {
  raul: { number: "00", classe: "UNC-Status", tagline: "// bio em construção — chama o cérebro da operação" },
  alex: { number: "07", classe: "Run & Gun", tagline: "// bio em construção — mira primeiro, fala depois" },
  baioni: { number: "11", classe: "AWPer Mafu", tagline: "// bio em construção — nunca sabe o que vem" },
  deh: { number: "21", classe: "Palavrinha", tagline: "// bio em construção — tá aqui desde o dia 1" },
  enzao: { number: "09", classe: "Forever Bot", tagline: "// bio em construção — sobe o áudio da call" },
  heitor: { number: "14", classe: "Tank", tagline: "// bio em construção — segura a pressão" },
  lucao: { number: "23", classe: "Rasta IGL", tagline: "// bio em construção — pergunta pros mais antigos" },
  primo: { number: "33", classe: "Jorts", tagline: "// bio em construção — sangue novo no esquadrão" },
  rodrigo: { number: "05", classe: "Pincelada", tagline: "// bio em construção — última linha de defesa" },
  soares: { number: "17", classe: "PJ Jamaica", tagline: "// bio em construção — chega antes da info" },
  tusha: { number: "88", classe: "Lua Cheia", tagline: "// bio em construção — faz o impossível na hora certa" },
  zepa: { number: "42", classe: "Vô Vê e Te Aviso", tagline: "// bio em construção — quem aperta o botão" },
};

export const FALLBACK_META: MemberMeta = {
  number: "--",
  classe: "Rapaziada",
  tagline: "// bio em construção",
};
