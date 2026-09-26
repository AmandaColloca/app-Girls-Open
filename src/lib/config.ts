export const NOME_DO_TORNEIO = "Girls Open";

export const SHEET_ID = process.env.SHEET_ID ?? "";

/** gid de cada aba da planilha (veja .env.example). */
export const ABAS = {
  instrucoes: process.env.GID_INSTRUCOES ?? "",
  jogos: process.env.GID_JOGOS ?? "",
  classificacao: process.env.GID_CLASSIFICACAO ?? "",
  diamante: process.env.GID_DIAMANTE ?? "",
  perola: process.env.GID_PEROLA ?? "",
  pontuacao: process.env.GID_PONTUACAO ?? "",
} as const;

export type Aba = keyof typeof ABAS;

/** Segundos até o app buscar a planilha de novo. */
export const REVALIDAR_SEGUNDOS = 300;

export const NOME_CHAVE = { diamante: "Chave Diamante", perola: "Chave Pérola" } as const;
