import { notFound } from "next/navigation";
import Abas from "@/components/Abas";
import Avisos from "@/components/Avisos";
import Chaveamento from "@/components/Chaveamento";
import { NOME_CHAVE } from "@/lib/config";
import { carregarChave, carregarGrupos } from "@/lib/dados";
import { CHAVES, type ChaveId } from "@/lib/tipos";

export const revalidate = 300;

export function generateStaticParams() {
  return CHAVES.map((chave) => ({ chave }));
}

const DESCRICAO: Record<ChaveId, string> = {
  diamante: "As 1ª e 2ª melhores colocadas de cada grupo.",
  perola: "As 3ª e a 4ª melhores colocadas de cada grupo.",
};

export default async function PaginaChave({ params }: { params: Promise<{ chave: string }> }) {
  const id = (await params).chave as ChaveId;
  if (!CHAVES.includes(id)) notFound();

  const [{ chave, erros }, { grupos }] = await Promise.all([carregarChave(id), carregarGrupos()]);
  const definidas = new Set(grupos.filter((g) => g.completo).flatMap((g) => g.classificacao.map((l) => l.jogadora)));
  return (
    <>
      <Abas
        rotulo="Escolher chave"
        ativo={id}
        itens={CHAVES.map((c) => ({ id: c, texto: NOME_CHAVE[c].replace("Chave ", ""), href: `/chaves/${c}` }))}
      />
      <h1 className="titulo-pagina">{NOME_CHAVE[id]}</h1>
      <p className="subtitulo">{DESCRICAO[id]}</p>
      <Avisos erros={erros} />
      <Chaveamento chave={chave} provisoria={!grupos.every((g) => g.completo)} definidas={definidas} />
    </>
  );
}
