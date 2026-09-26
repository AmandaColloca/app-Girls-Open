import type { MetadataRoute } from "next";
import { NOME_DO_TORNEIO } from "@/lib/config";

// Permite "Adicionar à tela inicial". Coloque icone-192.png e icone-512.png em /public.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NOME_DO_TORNEIO,
    short_name: NOME_DO_TORNEIO,
    start_url: "/",
    display: "standalone",
    background_color: "#F6F7F3",
    theme_color: "#2D5B8A",
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
