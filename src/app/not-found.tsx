import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <>
      <h1 className="titulo-pagina">Página não encontrada</h1>
      <p>
        Esse endereço não existe. <Link href="/">Voltar para o início</Link>
      </p>
    </>
  );
}
