import Avisos from "@/components/Avisos";
import TabelaRanking from "@/components/TabelaRanking";
import { carregarRanking } from "@/lib/dados";

export const revalidate = 300;

export default async function Ranking() {
  const { ranking, faseDeGruposEncerrada, erros } = await carregarRanking();

  return (
    <>
      <h1 className="titulo-pagina">Ranking</h1>
      <p className="subtitulo">
        Pontos da colocação no grupo somados aos da fase alcançada na chave. Acumulam para o ranking anual.
      </p>
      <Avisos erros={erros} />
      {!faseDeGruposEncerrada && (
        <p className="aviso">
          Cada jogadora recebe os pontos da fase de grupos depois que todos os jogos do grupo terminarem. Os pontos do mata-mata entram depois que todos os grupos terminarem.
        </p>
      )}
      <section className="bloco">
        <TabelaRanking linhas={ranking} />
      </section>
    </>
  );
}
