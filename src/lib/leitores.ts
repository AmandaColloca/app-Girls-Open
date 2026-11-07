/**
 * Leitores de cada aba da planilha Girls-open.
 * Localizam os blocos pelos rótulos ("GRUPO A", "QF1", "SF1"...) em vez de
 * posições fixas, então pequenas mudanças de layout não quebram o app.
 */
import { acharLinha, cel, numero, type Tabela } from "./planilha";
import {
  GRUPOS,
  type Chave,
  type ChaveId,
  type Fase,
  type Grupo,
  type GrupoId,
  type Jogo,
  type LinhaClassificacao,
  type Partida,
  type Regra,
  type TabelaPontos,
} from "./tipos";

// ---------- Instruções ----------
export function lerRegras(t: Tabela): Regra[] {
  const inicio = acharLinha(t, "A", "RESUMO DO REGULAMENTO");
  const regras: Regra[] = [];
  for (let i = inicio + 1; i < t.length; i++) {
    const titulo = cel(t, i, "A");
    const texto = cel(t, i, "B");
    if (titulo && texto) regras.push({ titulo, texto });
  }
  return regras;
}

// ---------- Jogos - Grupos ----------
export function lerJogos(t: Tabela): Jogo[] {
  const cabecalho = acharLinha(t, "A", "Jogo");
  if (cabecalho < 0) return [];

  const jogos: Jogo[] = [];
  for (let i = cabecalho + 1; i < t.length; i++) {
    const grupo = cel(t, i, "B") as GrupoId;
    if (!GRUPOS.includes(grupo)) continue;
    const n = (c: string) => numero(cel(t, i, c));
    const wo = cel(t, i, "K").toUpperCase();
    jogos.push({
      codigo: cel(t, i, "A"),
      grupo,
      jogadoraA: cel(t, i, "C"),
      jogadoraB: cel(t, i, "D"),
      sets: [
        [n("E"), n("F")],
        [n("G"), n("H")],
      ],
      stb: [n("I"), n("J")],
      wo: wo === "A" || wo === "B" ? wo : "",
      vencedora: cel(t, i, "L"),
      observacoes: cel(t, i, "Q"),
      data: cel(t, i, "R"), // DD-MM-AAAA
    });
  }
  return jogos;
}

// ---------- Classificação ----------
function lerBlocoGrupo(t: Tabela, grupo: GrupoId): LinhaClassificacao[] {
  const titulo = acharLinha(t, "A", `GRUPO ${grupo}`);
  if (titulo < 0) return [];

  const linhas: LinhaClassificacao[] = [];
  // título → cabeçalho → 4 jogadoras
  for (let i = titulo + 2; i < titulo + 6; i++) {
    const jogadora = cel(t, i, "B");
    if (!jogadora) continue;
    const n = (c: string) => numero(cel(t, i, c)) ?? 0;
    linhas.push({
      posicao: n("A"),
      jogadora,
      jogos: n("C"),
      vitorias: n("D"),
      derrotas: n("E"),
      setsPro: n("F"),
      setsContra: n("G"),
      saldoSets: n("H"),
      gamesPro: n("I"),
      gamesContra: n("J"),
      saldoGames: n("K"),
    });
  }
  // A posição vem pronta da planilha (inclui o desempate manual).
  return linhas.sort((a, b) => a.posicao - b.posicao);
}

export function montarGrupos(classificacao: Tabela, jogos: Jogo[]): Grupo[] {
  return GRUPOS.map((id) => {
    const doGrupo = jogos.filter((j) => j.grupo === id);
    return {
      id,
      classificacao: lerBlocoGrupo(classificacao, id),
      jogos: doGrupo,
      completo: doGrupo.length > 0 && doGrupo.every((j) => j.vencedora),
    };
  });
}

// ---------- Chave Diamante / Chave Pérola ----------
/**
 * Nome de jogadora numa célula de fórmula. Fórmulas como =I20 apontando
 * para uma célula vazia devolvem 0, que aqui vira "ainda não definida".
 */
const nome = (t: Tabela, linha: number, coluna: string) => {
  const v = cel(t, linha, coluna);
  return v === "0" ? "" : v;
};

function lerPartida(t: Tabela, rotulo: string): Partida {
  const i = acharLinha(t, "E", rotulo);
  return {
    rotulo,
    jogadoraA: nome(t, i, "F"),
    jogadoraB: nome(t, i, "G"),
    placar: cel(t, i, "H"),
    vencedora: nome(t, i, "I"),
  };
}

/** "Bye" ocupa vaga de uma jogadora desclassificada */
export const ehBye = (nome: string) => nome.toLowerCase() === "bye";

/** Se um dos lados é bye, a outra jogadora avança */
function resolverBye(p: Partida): Partida {
  if (p.vencedora) return p;
  if (ehBye(p.jogadoraA) && p.jogadoraB && !ehBye(p.jogadoraB)) return { ...p, vencedora: p.jogadoraB };
  if (ehBye(p.jogadoraB) && p.jogadoraA && !ehBye(p.jogadoraA)) return { ...p, vencedora: p.jogadoraA };
  return p;
}
export function lerChave(t: Tabela, id: ChaveId): Chave {
  const cabecalho = acharLinha(t, "A", "Nº");
  const classificadas: Chave["classificadas"] = [];
  for (let i = cabecalho + 1; i <= cabecalho + 8 && cabecalho >= 0; i++) {
    classificadas.push({ origem: cel(t, i, "B"), jogadora: nome(t, i, "C") });
  }

  const quartas = ["QF1", "QF2", "QF3", "QF4"].map((r) => resolverBye(lerPartida(t, r)));
  const semis = ["SF1", "SF2"].map((r, i) => {
    const s = lerPartida(t, r);
    return resolverBye({ ...s, jogadoraA: quartas[i * 2].vencedora, jogadoraB: quartas[i * 2 + 1].vencedora });
  });
  const linhaFinal = acharLinha(t, "E", "SF1");
  const final = resolverBye({
    rotulo: "Final",
    jogadoraA: nome(t, linhaFinal, "K") || semis[0].vencedora,
    jogadoraB: nome(t, linhaFinal, "L") || semis[1].vencedora,
    placar: cel(t, linhaFinal, "M"),
    vencedora: nome(t, linhaFinal, "N"),
  });

  return { id, classificadas, quartas, semis, final };
}

// ---------- Pontuação ----------
export const PONTOS_PADRAO: TabelaPontos = {
  grupos: [400, 320, 260, 200],
  diamante: { campea: 1000, vice: 650, semi: 400, quartas: 200 },
  perola: { campea: 250, vice: 165, semi: 100, quartas: 50 },
};

export function lerPontuacao(t: Tabela): TabelaPontos {
  const cab = acharLinha(t, "A", "Fase de grupos");
  if (cab < 0) return PONTOS_PADRAO;

  const valor = (linha: number, c: string, padrao: number) =>
    numero(cel(t, cab + linha, c)) ?? padrao;
  const fases: Fase[] = ["campea", "vice", "semi", "quartas"];
  const porFase = (c: string, padrao: Record<Fase, number>) =>
    Object.fromEntries(fases.map((f, i) => [f, valor(i + 1, c, padrao[f])])) as Record<Fase, number>;

  return {
    grupos: PONTOS_PADRAO.grupos.map((p, i) => valor(i + 1, "B", p)),
    diamante: porFase("E", PONTOS_PADRAO.diamante),
    perola: porFase("H", PONTOS_PADRAO.perola),
  };
}
