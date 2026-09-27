import Link from "next/link";
import Avisos from "@/components/Avisos";
import TabelaClassificacao from "@/components/TabelaClassificacao";
import { NOME_DO_TORNEIO } from "@/lib/config";
import { carregarGrupos } from "@/lib/dados";

export const revalidate = 300;

export default async function Inicio() {
  const { grupos, erros } = await carregarGrupos();
  const jogos = grupos.flatMap((g) => g.jogos);
  const disputados = jogos.filter((j) => j.vencedora).length;
  const ultimos = jogos.filter((j) => j.vencedora).slice(-3).reverse();

  return (
    <>
      <header className="quadra">
        <div className="quadra-linhas" aria-hidden="true" />
        <h1>{NOME_DO_TORNEIO}</h1>
      </header>

      <p>
        Fase de grupos: {disputados} de {jogos.length || 24} jogos disputados
      </p>

      <Avisos erros={erros} />

      {ultimos.length > 0 && (
        <section className="bloco">
          <h2>Últimos resultados</h2>
          <ul className="ultimos">
            {ultimos.map((j) => (
              <li key={j.codigo}>
                <strong>{j.vencedora}</strong> venceu{" "}
                {j.vencedora === j.jogadoraA ? j.jogadoraB : j.jogadoraA}
                <span className="origem"> Grupo {j.grupo}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="legenda">
        <div>
          <span className="marca marca-diamante" /> 1ª e 2ª vão para a Chave Diamante
        </div>
        <div>
          <span className="marca marca-perola" /> 3ª e 4ª vão para a Chave Pérola
        </div>
      </div>

      <div className="grade-grupos">
        {grupos.map((g) => (
          <section key={g.id} className="cartao-grupo">
            <div className="cartao-topo">
              <h2>Grupo {g.id}</h2>
              <Link href={`/grupos/${g.id.toLowerCase()}`}>Ver jogos</Link>
            </div>
            <TabelaClassificacao grupo={g} compacta />
          </section>
        ))}
      </div>
    </>
  );
}
