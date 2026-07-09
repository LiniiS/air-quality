# Prompts de Prototipação de UI — Claude Design

Documento de rastreabilidade do protótipo visual gerado com **Claude Design** (ferramenta de prototipação de interface da Anthropic, separada do assistente de codificação).

O arquivo de protótipo resultante está em [`docs/AirQuality.html`](AirQuality.html) — um bundle HTML autocontido com 4 telas renderizadas (Loading Skeleton, Dashboard, Previsão, Erro).

---

## Prompt 1: Dashboard Principal e Estado de Carregamento

> Atue como um Especialista em UI/UX e Acessibilidade (WCAG). Estamos desenvolvendo um app de monitoramento de qualidade do ar focado em usuários com problemas respiratórios (leigos em interpretação de dados brutos).
>
> Tarefa: Gere um protótipo visual (interface mobile) renderizado em React/Tailwind, apresentando dois estados lado a lado:
>
> Estado de Carregamento (Loading): Um Skeleton Screen limpo indicando onde os blocos carregarão (sem spinners tradicionais).
>
> Estado de Sucesso (Dashboard): A tela principal contendo:
>
> Um título no topo: "Como está o ar agora?".
>
> Um HeroStatusCard central para o status do ar indicando "Atenção: Qualidade moderada".
>
> Um PollenBadge menor indicando "Pólen: Nível Baixo".
>
> Um botão no rodapé escrito "Ver previsão para os próximos dias".
>
> Diretrizes de Estilo Rigorosas (NÃO desvie):
>
> Cores: Utilize EXCLUSIVAMENTE a seguinte paleta: Fundo geral (#def3f6), Textos principais e ícones de alto contraste (#064273), Botões principais/CTAs (#1da2d8), Elementos secundários ou bordas (#76b6c4 e #7fcdff).
>
> Ícones: Utilize APENAS a família de ícones Google Material Design (Material Symbols).
>
> Emojis: É ESTRITAMENTE PROIBIDO o uso de qualquer emoji na interface ou no código.
>
> Design: Mantenha um visual minimalista, cantos levemente arredondados, sem menus hambúrguer. Foque na redução da carga cognitiva.

---

## Prompt 2: Segunda Camada de Navegação (Previsão e Erro)

> A partir da arquitetura visual e da paleta definida na tela anterior, crie a segunda camada de navegação do aplicativo (Revelação Progressiva).
>
> Tarefa: Gere mais dois estados visuais em React/Tailwind lado a lado:
>
> Estado de Planejamento (Previsão): Uma tela com um botão de ícone "Voltar" (seta) no topo esquerdo. Abaixo, uma lista em formato de cards horizontais simples mostrando os próximos 3 dias com a previsão de temperatura e o status semântico do ar (ex: "Amanhã - 24°C - Ar Seguro").
>
> Estado de Erro (Empty State): Uma tela limpa exibindo um ícone grande (Material Design) de nuvem com erro ou conexão falha. Abaixo, o texto amigável: "Não foi possível carregar os dados do ambiente agora." e um botão grande "Tentar Novamente". Nenhuma mensagem de erro de servidor (ex: 500 ou Fetch Error) deve estar visível.
>
> Diretrizes de Estilo Rigorosas:
>
> Cores: Mantenha o fundo (#def3f6), textos escuros legíveis (#064273) e botões de ação em azul vibrante (#1da2d8).
>
> Ícones: Apenas Google Material Design. O ícone de erro deve ser semântico e claro.
>
> Emojis: NENHUM emoji deve ser utilizado.
>
> Acessibilidade: Garanta que o contraste entre as fontes e o fundo seja alto e que os elementos interativos tenham bom espaçamento (touch targets adequados).

---

## Telas Geradas

| Tela | Prompt | Descrição |
|---|---|---|
| Loading Skeleton | 1 | Skeleton screen sem spinners, blocos em placeholder |
| Dashboard | 1 | HeroStatusCard + PollenBadge + CTA de previsão |
| Previsão | 2 | Lista de cards horizontais para os próximos 3 dias |
| Erro / Empty State | 2 | Ícone Material Design + mensagem amigável + botão de retry |

## Design System Aplicado

| Elemento | Valor |
|---|---|
| Fundo | `#def3f6` |
| Textos / ícones primários | `#064273` |
| Botões / CTAs | `#1da2d8` |
| Elementos secundários | `#76b6c4` · `#7fcdff` |
| Ícones | Google Material Symbols (somente) |
| Emojis | Proibidos |
| Acessibilidade | WCAG 2.2 — alto contraste, touch targets adequados |
