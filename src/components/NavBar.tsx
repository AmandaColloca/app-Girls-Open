"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/", rotulo: "Início", icone: "M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/grupos", rotulo: "Grupos", icone: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/chaves", rotulo: "Chaves", icone: "M3 5h5v4H3zM3 15h5v4H3zM8 7h4v10H8M12 12h4M16 10h5v4h-5z" },
  { href: "/ranking", rotulo: "Ranking", icone: "M4 20V11h4v9M10 20V5h4v15M16 20v-6h4v6" },
  { href: "/regras", rotulo: "Regras", icone: "M6 3h9l4 4v14H6zM9 11h7M9 15h7M9 7h3" },
];

export default function NavBar() {
  const caminho = usePathname();

  return (
    <nav className="navbar" aria-label="Navegação principal">
      {ITENS.map(({ href, rotulo, icone }) => {
        const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={ativo ? "navbar-item ativo" : "navbar-item"}
            aria-current={ativo ? "page" : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={icone} />
            </svg>
            <span>{rotulo}</span>
          </Link>
        );
      })}
    </nav>
  );
}
