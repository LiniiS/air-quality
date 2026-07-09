# Registro de Prompts — AirQuality

Documento de rastreabilidade do processo de criação do aplicativo via IA generativa (Claude).  
Contém o prompt principal que originou o projeto e um resumo cronológico das iterações de refinamento.

---

## Prompt Principal

> Quero criar um aplicativo mobile em React Native com Expo para monitoramento da saúde respiratória.
> O app deve usar a localização atual do usuário para exibir:
> - A qualidade do ar (índice UAQI da Google Air Quality API)
> - A temperatura atual e a previsão dos próximos dias
> - Os níveis de pólen (Google Pollen API)
>
> O app deve seguir Clean Architecture (domain / data / presentation), usar Zustand para estado global, Axios para chamadas HTTP e React Navigation para navegação.
> A interface deve ser em português, acessível, com feedback visual claro para o usuário e tratamento de erros amigável.
> Use a Google Maps Platform (Weather API, Air Quality API, Pollen API) como fonte de dados.

---

## Iterações de Refinamento

### Fase 1 — Estrutura e dados

| # | Solicitação | Resultado |
|---|---|---|
| 1 | Configurar arquitetura Clean com domínio, repositórios e parsers | Criação das entidades `AirQuality`, `Pollen`, `Weather`; interfaces de repositório; DTOs e parsers para cada API Google |
| 2 | Integrar localização do dispositivo | Hook `useEnvironmentData` com `expo-location`, geocodificação reversa para nome da cidade, `Promise.allSettled` para busca paralela resiliente |
| 3 | Estado global | Store Zustand com `airQuality`, `pollen`, `weather`, `loading`, `error` |

### Fase 2 — Interface inicial

| # | Solicitação | Resultado |
|---|---|---|
| 4 | Dashboard principal | `DashboardScreen` com `HeroStatusCard` (UAQI + status), badge de pólen, temperatura atual, skeleton de carregamento e estado de erro com retry |
| 5 | Tela de detalhes de pólen | `PollenDetailScreen` com tipos por categoria (Gramíneas, Árvores, Ervas daninhas), indicação de sazonalidade, previsão de 3 dias e recomendações de saúde |
| 6 | Animação de splash | LottieView com `SplashBoundary` (error boundary) e timeout de segurança de 8s |

### Fase 3 — Previsão e refinamentos de UX

| # | Solicitação | Resultado |
|---|---|---|
| 7 | Tela de previsão (`ForecastScreen`) refatorada em duas seções independentes | Separação entre seção **Temperatura** (sempre visível, com ícone de condição climática) e seção **Qualidade do Ar** (adaptativa conforme disponibilidade) |
| 8 | Subtítulo condicional na previsão | Texto muda conforme o dado disponível: previsão completa / só temperatura / indisponível |
| 9 | Ícones de condição climática | Substituição de imagens externas (URLs quebravam) por `MaterialCommunityIcons` mapeados pelo campo `weatherCondition.type` da Weather API (`SUNNY`, `CLOUDY`, `RAIN`, etc.) |
| 10 | Remover sigla "QA" | Sempre escrever "Qualidade do ar" por extenso para melhor acessibilidade e clareza |

### Fase 4 — Diagnóstico de API e correções

| # | Solicitação | Resultado |
|---|---|---|
| 11 | Investigar erro 400 na Air Quality Forecast API | Identificado que `/forecast:lookup` retorna `INVALID_ARGUMENT` ("The specified time period is not supported") para todas as regiões, incluindo cidades com cobertura confirmada (Pittsburgh). Endpoint removido do repositório. |
| 12 | Exibir qualidade do ar real na previsão | `ForecastScreen` passou a ler `airQuality` (condição atual) do store Zustand — dado já carregado pelo Dashboard, sem chamada extra |
| 13 | Consistência de ícones | Padronização: `MaterialIcons` para ícones de UI; `MaterialCommunityIcons` exclusivamente para condições climáticas |

### Fase 5 — Planejador de viagem

| # | Solicitação | Resultado |
|---|---|---|
| 14 | Nova funcionalidade: consulta para destinos arbitrários | `TripPlannerScreen` com campo de busca → geocodificação → busca paralela de clima + QA atual + pólen |
| 15 | Adicionar dados de pólen ao planejador | `Promise.allSettled` expandido para incluir `PollenRepository.getCurrentPollen()` |
| 16 | Ícone de navegação mais inclusivo | Substituição do ícone `flight` por `pin-drop` (`MaterialIcons`) no Dashboard e no TripPlannerScreen |
| 17 | Qualidade do ar real no planejador | `AirQualityRepository.getCurrentAirQuality()` (endpoint `currentConditions:lookup`, global) adicionado ao `allSettled`; exibe `CurrentAQCard` com status, UAQI e descrição |
| 18 | Avisos de cobertura regional | `UnavailableNotice` exibido quando QA ou pólen não têm cobertura para a região pesquisada |

### Fase 6 — Qualidade de código e entregáveis

| # | Solicitação | Resultado |
|---|---|---|
| 19 | Remoção de comentários e logs de debug | Limpeza em 11 arquivos: cabeçalhos decorativos, comentários inline, JSX comments e `console.log` de debug removidos; `console.error` operacionais mantidos |
| 20 | Documentação de funcionalidades | `docs/FEATURES.md` com descrição das 4 telas, índices UAQI/UPI, limitações conhecidas e APIs utilizadas |
| 21 | Testes unitários | 28 testes cobrindo os 3 parsers (`airQualityParser`, `pollenParser`, `weatherParser`): classificação de índices, boundary values, mapeamento de tipos, timezone safety, `jest.useFakeTimers` para resultados determinísticos |
| 22 | Ícone do aplicativo | SVG com duas nuvens (nuvem maior `#62C1E5`, nuvem menor `#B8E8F5`) gerado em `assets/icon.svg`; conversão para PNG 1024×1024 via `@resvg/resvg-js` com script `npm run generate-icons` |
| 23 | Preparação para git e build | `.gitignore` (exclui `.env`, `node_modules`, `.expo`); `eas.json` (perfil `preview` → APK, `production` → AAB); chave de API via EAS Secret |

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | React Native 0.81.5 · Expo SDK 54 |
| Linguagem | TypeScript 5 (strict) |
| Arquitetura | Clean Architecture (domain / data / presentation) |
| Estado | Zustand 4 |
| HTTP | Axios |
| Navegação | React Navigation 6 (Native Stack) |
| Ícones | `@expo/vector-icons` — MaterialIcons + MaterialCommunityIcons |
| Testes | Jest · jest-expo |
| Build | EAS Build (Expo Application Services) |
| APIs | Google Weather · Air Quality · Pollen · Geocoding · Maps |

---

## Limitações Conhecidas Identificadas Durante o Desenvolvimento

- **Air Quality Forecast (`/forecast:lookup`)**: retorna `400 INVALID_ARGUMENT` para todas as regiões testadas. Solução adotada: usar `currentConditions:lookup` (global) como substituto.
- **Pollen API**: cobertura regional limitada — indisponível em muitas cidades fora dos EUA/Europa.
- **Previsão de temperatura**: máximo de 5 dias futuros via Google Weather API.
