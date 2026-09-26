import type { Chave, Fase, Grupo, LinhaRanking, TabelaPontos } from "./tipos";

export const NOME_FASE: Record<Fase, string> = {
  campea: "Campeã",
  vice: "Vice",
  semi: "Semifinal",
  quartas: "Quartas",
};

/** Fase mais longe que a jogadora alcançou na chave. */
function faseAlcancada(chave: Chave, jogadora: string): Fase | null {
  const { final, semis, quartas } = chave;
  if (final.vencedora === jogadora) return "campea";
  if (final.vencedora && (final.jogadoraA === jogadora || final.jogadoraB === jogadora)) return "vice";
  if (semis.some((p) => p.jogadoraA === jogadora || p.jogadoraB === jogadora)) return "semi";
  if (quartas.some((p) => p.jogadoraA === jogadora || p.jogadoraB === jogadora)) return "quartas";
  return null;
}

/**
 * Pontos do ranking: colocação no grupo + fase alcançada na chave.
 * Os pontos de grupo só entram quando o grupo termina, e os de chave
 * só quando toda a fase de grupos termina (antes disso as chaves são provisórias).
 */
export function calcularRanking(grupos: Grupo[], chaves: Chave[], pontos: TabelaPontos): LinhaRanking[] {
  const faseDeGruposEncerrada = grupos.every((g) => g.completo);

  const linhas = grupos.flatMap((g) =>
    g.classificacao.map((l): LinhaRanking => {
      const pontosGrupo = g.completo ? pontos.grupos[l.posicao - 1] ?? 0 : 0;

      let chave: LinhaRanking["chave"] = null;
      let fase: Fase | null = null;
      if (faseDeGruposEncerrada) {
        for (const c of chaves) {
          const f = faseAlcancada(c, l.jogadora);
          if (f) {
            chave = c.id;
            fase = f;
            break;
          }
        }
      }
      const pontosChave = chave && fase ? pontos[chave][fase] : 0;

      return {
        jogadora: l.jogadora,
        grupo: g.id,
        posicaoGrupo: g.completo ? l.posicao : null,
        pontosGrupo,
        chave,
        fase,
        pontosChave,
        total: pontosGrupo + pontosChave,
      };
    })
  );

  return linhas.sort((a, b) => b.total - a.total || a.jogadora.localeCompare(b.jogadora, "pt-BR"));
}
