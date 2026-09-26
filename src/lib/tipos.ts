export const GRUPOS = ["A", "B", "C", "D"] as const;
export type GrupoId = (typeof GRUPOS)[number];

export const CHAVES = ["diamante", "perola"] as const;
export type ChaveId = (typeof CHAVES)[number];

/** Uma linha da aba "Jogos - Grupos". */
export interface Jogo {
  codigo: string; // A1, A2...
  grupo: GrupoId;
  jogadoraA: string;
  jogadoraB: string;
  sets: [number | null, number | null][]; // set 1 e set 2
  stb: [number | null, number | null];
  wo: "A" | "B" | "";
  vencedora: string;
  observacoes: string;
}

/** Uma linha de um grupo na aba "Classificação". */
export interface LinhaClassificacao {
  posicao: number;
  jogadora: string;
  jogos: number;
  vitorias: number;
  derrotas: number;
  setsPro: number;
  setsContra: number;
  saldoSets: number;
  gamesPro: number;
  gamesContra: number;
  saldoGames: number;
}

export interface Grupo {
  id: GrupoId;
  classificacao: LinhaClassificacao[];
  jogos: Jogo[];
  /** todos os 6 jogos do grupo têm vencedora */
  completo: boolean;
}

export interface Partida {
  rotulo: string; // QF1, SF1, Final
  jogadoraA: string;
  jogadoraB: string;
  placar: string;
  vencedora: string;
}

export interface Chave {
  id: ChaveId;
  classificadas: { origem: string; jogadora: string }[];
  quartas: Partida[];
  semis: Partida[];
  final: Partida;
}

export interface TabelaPontos {
  grupos: number[]; // 1º ao 4º
  diamante: Record<Fase, number>;
  perola: Record<Fase, number>;
}

export type Fase = "campea" | "vice" | "semi" | "quartas";

export interface Regra {
  titulo: string;
  texto: string;
}

export interface LinhaRanking {
  jogadora: string;
  grupo: GrupoId;
  posicaoGrupo: number | null;
  pontosGrupo: number;
  chave: ChaveId | null;
  fase: Fase | null;
  pontosChave: number;
  total: number;
}
