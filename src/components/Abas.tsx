import Link from "next/link";

/** Abas secundárias (Grupo A/B/C/D, Diamante/Pérola). */
export default function Abas({
  itens,
  ativo,
  rotulo,
}: {
  itens: { href: string; texto: string; id: string }[];
  ativo: string;
  rotulo: string;
}) {
  return (
    <nav className="abas" aria-label={rotulo}>
      {itens.map((i) => (
        <Link
          key={i.id}
          href={i.href}
          className={i.id === ativo ? "aba ativa" : "aba"}
          aria-current={i.id === ativo ? "page" : undefined}
        >
          {i.texto}
        </Link>
      ))}
    </nav>
  );
}
