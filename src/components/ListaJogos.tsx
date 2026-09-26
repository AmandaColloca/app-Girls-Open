import type { Jogo } from "@/lib/tipos";

/** "6-3, 4-6, 10-8" com o super tie-break marcado. */
function placar(j: Jogo): string | null {
  if (j.wo) return "W.O.";
  const sets = j.sets
    .filter(([a, b]) => a !== null && b !== null)
    .map(([a, b]) => `${a}-${b}`);
  if (sets.length < 2) return null;
  const [sa, sb] = j.stb;
  if (sa !== null && sb !== null) sets.push(`${sa}-${sb} STB`);
  return sets.join(", ");
}

export default function ListaJogos({ jogos }: { jogos: Jogo[] }) {
  if (jogos.length === 0) return <p className="vazio">Os jogos deste grupo ainda não foram cadastrados.</p>;

  return (
    <ul className="jogos">
      {jogos.map((j) => {
        const resultado = j.vencedora ? placar(j) : null;
        return (
          <li key={j.codigo} className="jogo">
            <span className="jogo-codigo">{j.codigo}</span>
            <div className="jogo-corpo">
              <div className="jogo-linha">
                <span className={j.vencedora === j.jogadoraA ? "vencedora" : undefined}>{j.jogadoraA}</span>
                <span className="x">x</span>
                <span className={j.vencedora === j.jogadoraB ? "vencedora" : undefined}>{j.jogadoraB}</span>
              </div>
              <div className={j.vencedora ? "placar" : "placar pendente"}>
                {j.vencedora ? resultado ?? `Vitória de ${j.vencedora}` : "A jogar"}
              </div>
              {j.observacoes && <p className="jogo-obs">{j.observacoes}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
