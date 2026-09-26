import type { Grupo } from "@/lib/tipos";

const sinal = (n: number) => (n > 0 ? `+${n}` : String(n));
const zona = (posicao: number) => (posicao <= 2 ? "zona-diamante" : "zona-perola");

export default function TabelaClassificacao({
  grupo,
  compacta = false,
}: {
  grupo: Grupo;
  compacta?: boolean;
}) {
  if (grupo.classificacao.length === 0) {
    return <p className="vazio">A classificação do Grupo {grupo.id} ainda não está disponível.</p>;
  }

  return (
    <div className="tabela-rolagem">
      <table className="tabela">
        <thead>
          <tr>
            <th scope="col" className="pos">#</th>
            <th scope="col" className="nome">Jogadora</th>
            <th scope="col" title="Jogos">J</th>
            <th scope="col" title="Vitórias">V</th>
            {!compacta && <th scope="col" title="Derrotas">D</th>}
            <th scope="col" title="Saldo de sets">SS</th>
            <th scope="col" title="Saldo de games">SG</th>
            {!compacta && <th scope="col" title="Games vencidos">G+</th>}
          </tr>
        </thead>
        <tbody>
          {grupo.classificacao.map((l) => (
            <tr key={l.jogadora} className={zona(l.posicao)}>
              <td className="pos">{l.posicao}</td>
              <td className="nome">{l.jogadora}</td>
              <td>{l.jogos}</td>
              <td className="destaque">{l.vitorias}</td>
              {!compacta && <td>{l.derrotas}</td>}
              <td>{sinal(l.saldoSets)}</td>
              <td>{sinal(l.saldoGames)}</td>
              {!compacta && <td>{l.gamesPro}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
