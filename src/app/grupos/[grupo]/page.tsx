import { notFound } from "next/navigation";
import Abas from "@/components/Abas";
import Avisos from "@/components/Avisos";
import ListaJogos from "@/components/ListaJogos";
import TabelaClassificacao from "@/components/TabelaClassificacao";
import { carregarGrupos } from "@/lib/dados";
import { GRUPOS, type GrupoId } from "@/lib/tipos";

export const revalidate = 300;

export function generateStaticParams() {
  return GRUPOS.map((g) => ({ grupo: g.toLowerCase() }));
}

export default async function PaginaGrupo({ params }: { params: Promise<{ grupo: string }> }) {
  const id = (await params).grupo.toUpperCase() as GrupoId;
  if (!GRUPOS.includes(id)) notFound();

  const { grupos, erros } = await carregarGrupos();
  const grupo = grupos.find((g) => g.id === id)!;

  return (
    <>
      <Abas
        rotulo="Escolher grupo"
        ativo={id}
        itens={GRUPOS.map((g) => ({ id: g, texto: g, href: `/grupos/${g.toLowerCase()}` }))}
      />
      <h1 className="titulo-pagina">Grupo {id}</h1>
      <Avisos erros={erros} />

      <section className="bloco">
        <h2>Classificação</h2>
        <TabelaClassificacao grupo={grupo} />
        <p className="nota">
          Desempate: vitórias, saldo de sets, saldo de games, games vencidos, confronto direto e sorteio.
        </p>
      </section>

      <section className="bloco">
        <h2>Jogos</h2>
        <ListaJogos jogos={grupo.jogos} />
      </section>
    </>
  );
}
