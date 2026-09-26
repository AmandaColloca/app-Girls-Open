import type { Chave, Partida } from "@/lib/tipos";

/** Mantém só os nomes de jogadoras cujo grupo já terminou. */
function filtrar(p: Partida, definidas: Set<string>): Partida {
  const f = (nome: string) => (definidas.has(nome) ? nome : "");
  return { ...p, jogadoraA: f(p.jogadoraA), jogadoraB: f(p.jogadoraB), vencedora: f(p.vencedora) };
}

function Lado({ nome, venceu }: { nome: string; venceu: boolean }) {
  return <span className={venceu ? "lado vencedora" : "lado"}>{nome || "A definir"}</span>;
}

function CartaoPartida({ p }: { p: Partida }) {
  return (
    <div className="partida">
      <span className="partida-rotulo">{p.rotulo}</span>
      <Lado nome={p.jogadoraA} venceu={!!p.vencedora && p.vencedora === p.jogadoraA} />
      <Lado nome={p.jogadoraB} venceu={!!p.vencedora && p.vencedora === p.jogadoraB} />
      {p.placar && <span className="partida-placar">{p.placar}</span>}
    </div>
  );
}

export default function Chaveamento({
  chave,
  provisoria,
  definidas,
}: {
  chave: Chave;
  provisoria: boolean;
  definidas: Set<string>;
}) {
  chave = {
    ...chave,
    quartas: chave.quartas.map((p) => filtrar(p, definidas)),
    semis: chave.semis.map((p) => filtrar(p, definidas)),
    final: filtrar(chave.final, definidas),
    classificadas: chave.classificadas.map((c) => ({
      ...c,
      jogadora: definidas.has(c.jogadora) ? c.jogadora : "",
    })),
  };

  return (
    <>
      {provisoria && (
        <p className="aviso">
          Chave provisória: os nomes aparecem conforme cada grupo termina os seus 6 jogos.
        </p>
      )}

      <div className="tabela-rolagem">
        <div className={'chaveamento chave-${chave.id}'}>
          <div className="rodada">
            <h3>Quartas</h3>
            {chave.quartas.map((p) => (
              <CartaoPartida key={p.rotulo} p={p} />
            ))}
          </div>
          <div className="rodada">
            <h3>Semifinais</h3>
            {chave.semis.map((p) => (
              <CartaoPartida key={p.rotulo} p={p} />
            ))}
          </div>
          <div className="rodada">
            <h3>Final</h3>
            <CartaoPartida p={chave.final} />
            {chave.final.vencedora && (
              <p className="campea">
                Campeã: <strong>{chave.final.vencedora}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="bloco">
        <h2>Classificadas</h2>
        <ul className="classificadas">
          {chave.classificadas.map((c) => (
            <li key={c.origem}>
              <span className="origem">{c.origem}</span>
              <span>{c.jogadora || "A definir"}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}