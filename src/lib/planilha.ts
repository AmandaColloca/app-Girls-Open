import Papa from "papaparse";
import { ABAS, REVALIDAR_SEGUNDOS, SHEET_ID, type Aba } from "./config";

/** Uma aba como grade de células, igual à planilha: tabela[linha][coluna]. */
export type Tabela = string[][];

export interface Leitura {
  tabela: Tabela;
  erro?: string;
}

/** Busca uma aba da planilha como CSV (valores já calculados pelas fórmulas). */
export async function lerAba(aba: Aba): Promise<Leitura> {
  const gid = ABAS[aba];
  if (!SHEET_ID || !gid) {
    return { tabela: [], erro: `Falta configurar o gid da aba "${aba}" nas variáveis de ambiente.` };
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDAR_SEGUNDOS } });
    if (!res.ok) throw new Error(`O Google respondeu com status ${res.status}.`);
    const texto = await res.text();
    if (texto.trimStart().startsWith("<")) {
      throw new Error("A planilha pediu login. Compartilhe como 'Qualquer pessoa com o link – Leitor'.");
    }
    return { tabela: Papa.parse<string[]>(texto).data };
  } catch (e) {
    const erro = e instanceof Error ? e.message : String(e);
    console.error(`Falha ao ler a aba ${aba}:`, erro);
    return { tabela: [], erro };
  }
}

// ---------- utilitários para navegar na grade ----------

/** Índice da coluna a partir da letra: "A" → 0, "L" → 11. */
export const col = (letra: string) => letra.toUpperCase().charCodeAt(0) - 65;

/** Valor de uma célula, sem espaços extras. `linha` começa em 0. */
export const cel = (t: Tabela, linha: number, coluna: string) =>
  (t[linha]?.[col(coluna)] ?? "").trim();

const normalizar = (s: string) =>
  s.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Procura a linha em que a coluna tem exatamente o texto (sem diferenciar acentos). */
export function acharLinha(t: Tabela, coluna: string, texto: string, aPartirDe = 0): number {
  const alvo = normalizar(texto);
  for (let i = aPartirDe; i < t.length; i++) {
    if (normalizar(cel(t, i, coluna)) === alvo) return i;
  }
  return -1;
}

export function numero(valor: string): number | null {
  if (!valor) return null;
  const n = Number(valor.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
