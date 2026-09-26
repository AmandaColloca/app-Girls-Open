import Avisos from "@/components/Avisos";
import { carregarRegras } from "@/lib/dados";

export const revalidate = 300;

export default async function Regras() {
  const { regras, pontos, erros } = await carregarRegras();
  const posicoes = ["1º", "2º", "3º", "4º"];

  return (
    <>
      <h1 className="titulo-pagina">Regras</h1>
      <Avisos erros={erros} />

      <dl className="regras">
        {regras
          .filter((r) => r.titulo !== "Uso")
          .map((r) => (
            <div key={r.titulo}>
              <dt>{r.titulo}</dt>
              <dd>{r.texto}</dd>
            </div>
          ))}
      </dl>

      <section className="bloco">
        <h2>Pontuação do ranking</h2>
        <div className="grade-pontos">
          <table className="tabela">
            <caption>Fase de grupos</caption>
            <tbody>
              {pontos.grupos.map((p, i) => (
                <tr key={i}>
                  <td className="nome">{posicoes[i]} lugar</td>
                  <td className="pts">{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(["diamante", "perola"] as const).map((c) => (
            <table key={c} className="tabela">
              <caption>{c === "diamante" ? "Diamante" : "Pérola"}</caption>
              <tbody>
                <tr><td className="nome">Campeã</td><td className="pts">{pontos[c].campea}</td></tr>
                <tr><td className="nome">Vice</td><td className="pts">{pontos[c].vice}</td></tr>
                <tr><td className="nome">Semifinal</td><td className="pts">{pontos[c].semi}</td></tr>
                <tr><td className="nome">Quartas</td><td className="pts">{pontos[c].quartas}</td></tr>
              </tbody>
            </table>
          ))}
        </div>
      </section>
    </>
  );
}
