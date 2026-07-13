# 🌬️ Air Quality — Monitoramento Ambiental Inclusivo

> **Sobre este repositório:** Mais do que um aplicativo funcional, este projeto é o artefato prático desenvolvido para o Trabalho Final da disciplina de Interação Humano-Computador (IHC) e Interação Humano-Dados (IHD).

---

## 📖 A Origem do Projeto

O **Air Quality** nasceu de uma reflexão sobre como os dados ambientais são expostos ao público geral. Hoje, plataformas climáticas fornecem um volume imenso de dados brutos (como índices de qualidade do ar em *ppm* ou µg/m³ e contagens de pólen).

No entanto, para pessoas leigas que possuem condições respiratórias sensíveis (como asma, bronquite ou DPOC), números isolados não respondem à pergunta mais urgente do seu dia a dia: *"É seguro sair de casa hoje?"*.

A origem desta atividade acadêmica foi utilizar as premissas do **Lean UX** e as diretrizes do **Nielsen Norman Group (NN/g)** para entender a dor dessas personas e projetar uma interface que não apenas informasse, mas protegesse.

---

## 🎯 A Proposta e o Foco em IHD/IHC

A premissa central deste aplicativo é a **Redução da Carga Cognitiva** e a **Tradução Semântica de Dados**. Para isso, o desenvolvimento do aplicativo foi pautado pela metodologia **SPEC-Driven Development**, onde as regras de interação e acessibilidade ditaram a arquitetura do código antes mesmo da primeira linha ser escrita.

Neste projeto, você encontrará a aplicação prática dos seguintes conceitos:

- **Interação Humano-Dados (IHD):** Substituição de valores numéricos complexos por um *Status Semântico Acionável* ("Seguro", "Atenção", "Perigo"). O dado bruto é processado nos bastidores (via Google Air Quality API) e entregue como informação útil e imediata ao usuário leigo.

- **Revelação Progressiva (Progressive Disclosure):** Um *Dashboard* inicial extremamente limpo focado na ação de curtíssimo prazo, com a previsão estendida delegada a uma segunda camada de navegação (módulo de planejamento) para usuários que desejam cruzar mais informações.

- **Acessibilidade Rigorosa (WCAG 2.2):** O design system (baseado na paleta *Ocean Blue*) foi estruturado para garantir alto contraste (4.5:1). Além disso, a aplicação proíbe o uso de cores como único indicativo de alerta, exigindo sempre redundância com ícones (Material Design) e atributos semânticos (`accessible={true}`, `accessibilityLabel`) no código para total suporte a leitores de tela.

---

## 🛠️ Sobre a Implementação Técnica

O aplicativo foi desenvolvido em **React Native (Expo)**, utilizando os princípios de **Clean Architecture** para isolar as chamadas às APIs reais do Google Maps Platform (Air Quality, Pollen) da camada de apresentação (UI). Ferramentas de Inteligência Artificial Generativa foram utilizadas como agentes assistentes de codificação, sempre guiadas pelas restrições rigorosas da nossa Especificação (SPEC) de IHC.

---

## 📱 Funcionalidades

| Tela | Descrição |
|---|---|
| **Dashboard** | Qualidade do ar atual (UAQI), temperatura e nível de pólen da localização do usuário |
| **Previsão** | Temperatura máxima para os próximos 3 dias com ícone de condição climática |
| **Detalhe de Pólen** | Níveis por tipo (Gramíneas, Árvores, Ervas daninhas), sazonalidade e recomendações de saúde |
| **Planejador de Viagem** | Consulta de temperatura, qualidade do ar e pólen para qualquer cidade do mundo |

### Índice de Qualidade do Ar (UAQI)

| Status | Faixa | Significado |
|---|---|---|
| 🟢 Seguro | 60–100 | Atividades ao ar livre sem restrição |
| 🟡 Atenção | 40–59 | Evitar esforços intensos se houver sensibilidade respiratória |
| 🔴 Perigo | 0–39 | Evitar atividades ao ar livre; manter janelas fechadas |

---

## 🎬 Demonstração

[![Demonstração do App](https://img.youtube.com/vi/s61Ino9Ayfk/0.jpg)](https://youtube.com/shorts/s61Ino9Ayfk)

---

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**, separando responsabilidades em três camadas independentes:

```
src/
├── domain/          # Entidades e interfaces de repositório (sem dependências externas)
│   ├── entities/
│   └── repositories/
├── data/            # Implementações: HTTP clients, DTOs, parsers, repositórios
│   ├── dtos/
│   ├── http/
│   ├── parsers/
│   └── repositories/
└── presentation/    # UI: telas, componentes, hooks, store, tema
    ├── components/
    ├── hooks/
    ├── screens/
    ├── store/
    └── theme/
```

### Stack

| Camada | Tecnologia |
|---|---|
| Framework | React Native 0.81.5 · Expo SDK 54 |
| Linguagem | TypeScript 5 (strict) |
| Estado global | Zustand 4 |
| HTTP | Axios |
| Navegação | React Navigation 6 (Native Stack) |
| Ícones | MaterialIcons · MaterialCommunityIcons (`@expo/vector-icons`) |
| Testes | Jest · jest-expo |
| Build | EAS Build (Expo Application Services) |

### APIs utilizadas

| API | Finalidade |
|---|---|
| Google Air Quality API | Índice UAQI e condição atual de qualidade do ar |
| Google Pollen API | Níveis de pólen por tipo e previsão |
| Google Weather API | Temperatura atual e previsão de até 5 dias |
| Google Geocoding API | Conversão de nome de cidade em coordenadas |

---

## 🚀 Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) 18+
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)
- Chave de API do [Google Maps Platform](https://console.cloud.google.com) com as seguintes APIs habilitadas:
  - Air Quality API
  - Pollen API
  - Weather API
  - Geocoding API

### Instalação

```bash
# Clone o repositório
git clone git@github.com:LiniiS/air-quality.git
cd air-quality

# Instale as dependências
npm install
```

### Configuração de variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` e insira sua chave:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

### Executar

```bash
npm start
```

Escaneie o QR Code com o app Expo Go. O app estará disponível em segundos.

---

## 🧪 Testes

Os testes cobrem os três parsers de dados (28 casos no total), incluindo classificação de índices, boundary values, mapeamento de tipos e isolamento de timezone.

```bash
npm test
```

---

## 📦 Build APK

O build é feito na nuvem via [EAS Build](https://expo.dev/eas). Configure a chave de API como secret antes do primeiro build:

```bash
# Instale o EAS CLI (uma vez)
npm install -g eas-cli

# Autentique
eas login

# Cadastre a chave como secret no projeto
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_MAPS_API_KEY --value sua_chave_aqui

# Gere o APK
eas build --platform android --profile preview
```

O link de download do `.apk` é gerado ao final do build.

---

## 📄 Documentação adicional

| Arquivo | Conteúdo |
|---|---|
| [Documento do Projeto (Google Drive)](https://drive.google.com/file/d/1X0wkZ7dWkMESy6M2j4WfA4woHTyBuimv/view?usp=sharing) | Documento acadêmico completo do Trabalho Final de IHC/IHD |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Descrição detalhada de cada funcionalidade e índices utilizados |
| [`docs/PROMPTS.md`](docs/PROMPTS.md) | Registro dos prompts e iterações de refinamento com IA generativa |
| [`docs/UI_PROTOTYPE_PROMPTS.md`](docs/UI_PROTOTYPE_PROMPTS.md) | Prompts utilizados no Claude Design para geração do protótipo visual de UI |
| [`docs/AirQuality.html`](docs/AirQuality.html) | Protótipo visual interativo (4 telas: Loading, Dashboard, Previsão, Erro) gerado com Claude Design |
| [`docs/ACCESSIBILITY_AUDIT.md`](docs/ACCESSIBILITY_AUDIT.md) | Auditoria de acessibilidade com Google Accessibility Scanner — débitos técnicos e análise crítica sobre os limites da geração por IA |

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como artefato prático do Trabalho Final das disciplinas de **Interação Humano-Computador (IHC)** e **Interação Humano-Dados (IHD)** do curso de pós-graduação.

O desenvolvimento utilizou IA Generativa (Claude — Anthropic) como agente assistente de codificação, com todas as decisões de design e interação guiadas pela especificação de IHC elaborada previamente. O registro completo das iterações está documentado em [`docs/PROMPTS.md`](docs/PROMPTS.md).
