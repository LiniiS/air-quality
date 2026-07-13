# Auditoria de Acessibilidade (Accessibility Scanner)

Como parte do compromisso contínuo com a qualidade e inclusão deste projeto, realizamos uma auditoria automatizada utilizando o **Google Accessibility Scanner** no APK final gerado.

O objetivo desta seção é documentar os débitos técnicos encontrados e mapear oportunidades de melhoria (sem alteração imediata de código), servindo como base para futuras iterações do aplicativo.

---

## Escopo da Auditoria

A análise cobriu 4 telas do aplicativo em 6 capturas de estado distintas:

| Relatório | Tela | Estado |
|---|---|---|
| report1 / report3 | Dashboard | Estado de sucesso (dados carregados) |
| report2 | Previsão (`ForecastScreen`) | Lista de próximos dias + card de qualidade do ar |
| report4 | Planejador de Viagem (`TripPlannerScreen`) | Estado vazio (sem busca) |
| report5 | Planejador de Viagem | Campo de texto ativo (teclado aberto) |
| report6 | Planejador de Viagem | Resultado exibido (cidade: Bonito - MS) |

---

## Resultados da Análise e Oportunidades de Melhoria

O Scanner apontou três categorias principais de falhas que precisam ser ajustadas nas próximas versões:

### 1. Contraste de Texto Insuficiente

Embora a paleta *Ocean Blue* tenha sido concebida para alto contraste, a implementação cruzou cores secundárias de forma incorreta.

| Combinação de cores | Razão medida | Mínimo WCAG exigido | Telas afetadas |
|---|---|---|---|
| `#76B6C4` sobre `#DEF3F6` | **1.97:1** | 4.50:1 (texto normal) | Dashboard, Previsão, Planejador |
| `#76B6C4` sobre `#FFFFFF` | **2.27:1** | 4.50:1 (texto normal) | Previsão, Planejador |
| `#1DA2D8` sobre `#DEF3F6` | **2.53:1** | 4.50:1 (texto normal) | Dashboard, Previsão |
| `#1DA2D8` sobre `#FFFFFF` | **2.91:1** | 4.50:1 (texto normal) | Previsão, Planejador |
| `#FFFFFF` sobre `#1DA2D8` | **2.91:1** | 4.50:1 (texto normal) | Botões CTA do Dashboard |
| `#DEF3F6` sobre `#FFFFFF` | **1.15:1** | 4.50:1 (texto normal) | Resultados do Planejador |

**Sugestão:** Revisar o mapeamento de cores nos componentes. O texto secundário deve ser escurecido ou a aplicação deve forçar o uso da cor primária (`#064273`) para garantir legibilidade. A cor `#76B6C4` deve ser usada apenas como borda ou preenchimento decorativo — nunca como cor de texto.

---

### 2. Áreas de Toque (Touch Targets) Reduzidas

O tamanho dos botões e áreas interativas ficou abaixo do padrão de usabilidade móvel.

| Elemento | Tamanho medido | Mínimo recomendado | Telas afetadas |
|---|---|---|---|
| Botão "Voltar" (ícone `←`) | **42 × 42 dp** | 48 × 48 dp | Previsão, Planejador |
| Campo de busca (`TextInput`) | **altura: 46 dp** | 48 dp | Planejador |
| Botão de busca (ícone lupa) | **46 × 46 dp** | 48 × 48 dp | Planejador |

**Sugestão:** Aumentar o `padding` ou o tamanho físico (`width`/`height`/`minHeight`) desses elementos para, no mínimo, **48 × 48 dp**, conforme as diretrizes do Material Design e WCAG 2.2 (Critério 2.5.8 — Target Size), facilitando o uso por pessoas com tremores motores ou baixa precisão de toque.

---

### 3. Falhas na Semântica de Leitores de Tela (Unexposed Text)

Houve falhas na forma como os textos e campos de entrada expõem seus dados para o sistema operacional Android.

**3a. Conflito em campos editáveis (`Editable item label`):**
O Scanner alertou que o `TextInput` do Planejador utiliza `android:contentDescription` (mapeado via `accessibilityLabel` no React Native), fazendo o TalkBack ler a *label* em vez do conteúdo digitado pelo usuário. Isso prejudica a experiência de quem usa leitor de tela durante a digitação.

**3b. Textos não expostos à árvore de acessibilidade (`Unexposed Text`):**

| Texto detectado | Tela | Problema |
|---|---|---|
| "O ar está limpo e seguro para todas as atividades ao ar livre." | Previsão | Texto estático dentro de componente agrupado sem `accessibilityLabel` |
| "Digite uma cidade ou região.." | Planejador (vazio) | Placeholder do `TextInput` não exposto |
| Conteúdo digitado ("boni") | Planejador (teclado) | Conteúdo do campo não acessível durante a digitação |
| "Quinta", "31°", "32°" | Planejador (resultados) | Células da lista de temperatura sem label semântico |
| "Qualidade do Ar" (seção) | Planejador (resultados) | Cabeçalho de seção não exposto como grupo |

**Sugestão:** Refatorar as propriedades de acessibilidade no React Native, garantindo que textos estáticos sejam agrupados corretamente com `accessibilityRole` e que os `TextInput`s usem `accessibilityLabel` apenas para identificação do campo — sem conflitar com o conteúdo editável. Cards de lista devem usar `accessible={true}` com `accessibilityLabel` composto (ex: `"Quinta, 31 graus"`).

---

## Visão Crítica: O Prompt vs. A Implementação Real

A realização deste teste revelou um aspecto fascinante e crítico sobre o desenvolvimento de software auxiliado por Inteligência Artificial (LLMs): **a especificidade de um *prompt* não garante a conformidade espacial e matemática na interface gerada.**

Durante a fase de *Spec-Driven Development*, nosso "Superprompt" foi extremamente explícito. Nós exigimos o uso da WCAG 2.2, proibimos dependência de cor isolada e definimos que todo elemento deveria estar envelopado com as tags de acessibilidade (`accessible={true}`). No entanto, a IA falhou na execução prática por três motivos estruturais:

**1. Ausência de Validação Matemática de Contraste**

A IA recebeu a paleta exata (`#DEF3F6`, `#064273`, `#1DA2D8`, `#76B6C4`). Contudo, ela combinou as cores esteticamente ao longo do código, sem calcular que aplicar `#76B6C4` sobre `#DEF3F6` quebraria a regra de 4.5:1 exigida no próprio *prompt*. A IA entende o *conceito* de contraste, mas falha em testá-lo matematicamente na geração do código.

**2. Medidas Físicas Padrão (Default Sizing)**

Ao gerar botões (`TouchableOpacity`) e campos (`TextInput`), o modelo de linguagem recorreu a padrões genéricos de estilo (como `padding: 10`), ignorando a regra de áreas de toque mínimas de 48 × 48 dp. LLMs tendem a favorecer layouts esteticamente compactos, a menos que sejam microgerenciados por dimensões explícitas no *prompt*.

**3. Semântica Superficial vs. Árvore de Acessibilidade**

A IA cumpriu a regra de adicionar as *props* de acessibilidade, mas de forma ingênua. Ela não consegue prever como a Árvore de Acessibilidade do Android irá compilar essas *props* em tempo de execução. Isso resultou em campos com conflito de `contentDescription` e textos completamente ocultos para o TalkBack — algo que nenhuma análise estática de código consegue revelar; apenas o teste no dispositivo real expõe.

---

## Conclusão

O uso de IA no design e desenvolvimento acelera exponencialmente a arquitetura estrutural (Clean Architecture, navegação, lógicas de API), mas **não substitui a etapa de auditoria humana e testes automatizados**. A acessibilidade real exige consciência espacial, validação matemática de contraste e execução no dispositivo físico — algo que os modelos de linguagem generativa atuais não conseguem garantir sozinhos a partir de texto.

Esta auditoria documenta o gap entre a intenção do *prompt* e o resultado entregue, e serve como roteiro para a próxima iteração do produto.
