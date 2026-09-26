/** Funções que as páginas usam: buscam as abas e devolvem dados prontos. */
import { lerAba } from "./planilha";
import { lerChave, lerJogos, lerPontuacao, lerRegras, montarGrupos } from "./leitores";
import { calcularRanking } from "./ranking";
import type { ChaveId } from "./tipos";

const erros = (...leituras: { erro?: string }[]) =>
  leituras.map((l) => l.erro).filter((e): e is string => Boolean(e));

export async function carregarGrupos() {
  const [jogos, classificacao] = await Promise.all([lerAba("jogos"), lerAba("classificacao")]);
  return {
    grupos: montarGrupos(classificacao.tabela, lerJogos(jogos.tabela)),
    erros: erros(jogos, classificacao),
  };
}

export async function carregarChave(id: ChaveId) {
  const leitura = await lerAba(id);
  return { chave: lerChave(leitura.tabela, id), erros: erros(leitura) };
}

export async function carregarRegras() {
  const [instrucoes, pontuacao] = await Promise.all([lerAba("instrucoes"), lerAba("pontuacao")]);
  return {
    regras: lerRegras(instrucoes.tabela),
    pontos: lerPontuacao(pontuacao.tabela),
    erros: erros(instrucoes, pontuacao),
  };
}

export async function carregarRanking() {
  const [{ grupos, erros: e1 }, d, p, pontuacao] = await Promise.all([
    carregarGrupos(),
    carregarChave("diamante"),
    carregarChave("perola"),
    lerAba("pontuacao"),
  ]);
  const pontos = lerPontuacao(pontuacao.tabela);
  return {
    ranking: calcularRanking(grupos, [d.chave, p.chave], pontos),
    faseDeGruposEncerrada: grupos.every((g) => g.completo),
    erros: [...e1, ...d.erros, ...p.erros, ...erros(pontuacao)],
  };
}
