import { NOME_CHAVE } from "@/lib/config";
import { NOME_FASE } from "@/lib/ranking";
import type { LinhaRanking } from "@/lib/tipos";

export default function TabelaRanking({ linhas }: { linhas: LinhaRanking[] }) {
  return (
    <div className="tabela-rolagem">
      <table className="tabela ranking">
        <thead>
          <tr>
            <th scope="col" className="pos">#</th>
            <th scope="col" className="nome">Jogadora</th>
            <th scope="col">Fase de grupos</th>
            <th scope="col">Mata-mata</th>
            <th scope="col" className="pts">Total</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={l.jogadora}>
              <td className="pos">{i + 1}</td>
              <td className="nome">
                {l.jogadora}
                <small>Grupo {l.grupo}</small>
              </td>
              <td>
                {l.posicaoGrupo ? (
                  <>
                    {l.posicaoGrupo}º lugar
                    <small>{l.pontosGrupo} pts</small>
                  </>
                ) : (
                  <small>em andamento</small>
                )}
              </td>
              <td>
                {l.chave && l.fase ? (
                  <>
                    {NOME_FASE[l.fase]}
                    <small>
                      {NOME_CHAVE[l.chave].replace("Chave ", "") + ", " + l.pontosChave + " pts"}
                    </small>
                  </>
                ) : (
                  <small>aguardando</small>
                )}
              </td>
              <td className="pts">{l.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}