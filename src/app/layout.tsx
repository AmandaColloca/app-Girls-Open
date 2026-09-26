import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import { NOME_DO_TORNEIO } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: NOME_DO_TORNEIO,
  description: "Classificação, jogos, chaves e ranking do Girls Open.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2D5B8A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="conteudo">{children}</main>
        <NavBar />
      </body>
    </html>
  );
}
