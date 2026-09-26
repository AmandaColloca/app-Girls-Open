# Girls Open

App web que lê a planilha **Girls-open** no Google Sheets e mostra classificação,
jogos, Chaves Diamante e Pérola, ranking de pontos e regras. Feito em
Next.js + TypeScript, pronto para publicar na Vercel.

A planilha continua sendo o lugar onde tudo é lançado. O app só lê os valores
já calculados pelas fórmulas, então a classificação, o desempate manual e os
cruzamentos das chaves aparecem exatamente como estão na planilha.

## De onde vem cada tela

| Tela | Abas lidas |
|------|-----------|
| Início | Jogos - Grupos, Classificação |
| Grupos | Classificação, Jogos - Grupos |
| Chaves | Chave Diamante, Chave Pérola |
| Ranking | Classificação, chaves e Pontuação (soma calculada pelo app) |
| Regras | Instruções, Pontuação |

A aba Jogadoras não é lida diretamente, porque os nomes já chegam pelas outras abas.

Os leitores (`src/lib/leitores.ts`) localizam cada bloco pelos rótulos da
planilha ("GRUPO A", "QF1", "SF1", "Fase de grupos"...). Mudar cores, larguras
ou inserir linhas em branco não quebra nada; renomear esses rótulos ou mover
colunas, sim.

## Pontos do ranking

- Colocação no grupo (400/320/260/200): entra quando os 6 jogos do grupo terminam.
- Fase alcançada na chave: entra quando toda a fase de grupos termina. Vale a
  fase mais longe (quartas, semi, vice ou campeã), com os valores da aba Pontuação.

## Configuração

1. A planilha precisa estar em **Compartilhar → Qualquer pessoa com o link → Leitor**.
2. Copie `.env.example` para `.env.local`. O `SHEET_ID` e o gid da aba
   Instruções já estão preenchidos.
3. Para cada outra aba, clique nela no Google Sheets e copie o número do fim da
   URL (`#gid=...`) para a variável correspondente.

## Rodando no computador

```
npm install
npm run dev
```

Abra http://localhost:3000.

## Publicando na Vercel

1. Suba a pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, cadastre as mesmas variáveis do `.env.local`.
4. Clique em **Deploy** e compartilhe o link.

O app busca a planilha de novo a cada 5 minutos (`REVALIDAR_SEGUNDOS` em
`src/lib/config.ts`).

## Estrutura

```
src/
  app/
    page.tsx              início: progresso, últimos resultados, 4 grupos
    grupos/[grupo]/       classificação e jogos de cada grupo
    chaves/[chave]/       chaveamento da Diamante e da Pérola
    ranking/              pontuação acumulada
    regras/               regulamento e tabela de pontos
    layout.tsx            layout + navigation bar
  components/             NavBar, Abas, TabelaClassificacao, ListaJogos,
                          Chaveamento, TabelaRanking, Avisos
  lib/
    config.ts             ID da planilha e gids das abas
    planilha.ts           busca CSV + utilitários de célula
    leitores.ts           interpreta cada aba
    ranking.ts            soma dos pontos
    dados.ts              funções usadas pelas páginas
    tipos.ts              tipos TypeScript
```
