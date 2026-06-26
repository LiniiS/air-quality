# Funcionalidades — AirQuality

Aplicativo React Native (Expo) para monitoramento da saúde respiratória. Exibe qualidade do ar, temperatura e níveis de pólen com base na localização do usuário, e permite consultar previsões para qualquer destino.

---

## Dashboard

Tela inicial. Exibe as condições ambientais da localização atual do dispositivo.

**O que é mostrado**
- Nome da cidade detectada automaticamente via GPS
- Temperatura atual
- Card principal de qualidade do ar: status (Seguro / Atenção / Perigo), índice UAQI e descrição orientativa
- Badge de pólen: nível predominante e tipo dominante (Gramíneas, Árvores ou Ervas daninhas)

**Comportamento**
- Solicita permissão de localização na primeira abertura
- Carrega qualidade do ar, pólen e clima em paralelo
- Exibe skeleton animado durante o carregamento
- Exibe mensagem de erro amigável se as APIs falharem, com botão de nova tentativa
- Se a API de pólen não tiver cobertura para a região, exibe "Em monitoramento" sem bloquear as demais informações

---

## Previsão — Próximos Dias

Tela de previsão da localização atual. Acessada pelo botão "Ver previsão para os próximos dias" no Dashboard.

**O que é mostrado**
- Seção **Temperatura**: previsão de máxima para os próximos 3 dias, com ícone de condição climática (sol, chuva, nuvem etc.)
- Seção **Qualidade do Ar**: comportamento adaptativo
  - Se dados de previsão diária de QA estiverem disponíveis: linhas por dia com status e ícone colorido
  - Se apenas a condição atual estiver disponível (caso típico): card único com status, índice UAQI, descrição e nota explicativa
  - Se nenhum dado estiver disponível: aviso informando a indisponibilidade regional
- Subtítulo dinâmico indica ao usuário quais dados estão sendo exibidos

**Limitação conhecida**
A API de previsão diária de qualidade do ar (`/forecast:lookup`) não está disponível nesta versão. A seção de qualidade do ar exibe a condição atual, que é global e sempre disponível.

---

## Detalhe de Pólen

Tela de detalhamento dos níveis de pólen. Acessada pelo badge de pólen no Dashboard.

**O que é mostrado**
- Nível de hoje por tipo: Gramíneas, Árvores e Ervas daninhas, com indicação de sazonalidade (em estação / fora de estação)
- Previsão de pólen para os próximos 3 dias
- Lista de recomendações de saúde fornecidas pela API (ex.: use máscara, evite parques, feche janelas)

**Níveis de pólen**
| Nível | Faixa UPI |
|---|---|
| Baixo | 0–2 |
| Moderado | 3–4 |
| Alto | 5 |

---

## Planejar Viagem

Tela de consulta para destinos arbitrários. Acessada pelo botão "Planejar viagem" no Dashboard.

**O que é mostrado**
- Campo de busca: o usuário digita o nome de qualquer cidade ou região
- Após a busca:
  - Nome formatado do local (via Google Geocoding)
  - Badge informando o número de dias de previsão disponíveis
  - Seção **Temperatura**: previsão de máxima para até 5 dias, com ícone de condição climática
  - Seção **Qualidade do Ar**: condição atual do destino (status, índice UAQI e descrição), ou aviso de indisponibilidade
  - Seção **Pólen**: previsão de até 3 dias futuros com nível por dia, ou aviso de indisponibilidade

**Comportamento**
- Geocoding, qualidade do ar e pólen são buscados em paralelo
- Falhas de qualidade do ar ou pólen são tratadas silenciosamente; somente falha de clima bloqueia o resultado
- Aviso de cobertura regional exibido quando dados de QA ou pólen não estão disponíveis para o destino

---

## Índices e Classificações

### Qualidade do Ar (UAQI — Universal Air Quality Index)

O Google Universal AQI usa uma escala de 0 a 100 onde valores mais altos indicam ar mais limpo.

| Status | Faixa UAQI | Ação recomendada |
|---|---|---|
| Seguro | 60–100 | Atividades ao ar livre sem restrição |
| Atenção | 40–59 | Evitar esforços intensos se houver sensibilidade respiratória |
| Perigo | 0–39 | Evitar atividades ao ar livre; manter janelas fechadas |

### Condição Climática (Weather Type)

Tipos retornados pela Google Weather API são mapeados para ícones visuais. Exemplos: `SUNNY`, `CLOUDY`, `RAIN`, `THUNDERSTORM`, `SNOW`.

---

## APIs Utilizadas

| API | Finalidade |
|---|---|
| Google Weather API | Condição atual e previsão de temperatura |
| Google Air Quality API | Condição atual de qualidade do ar (UAQI) |
| Google Pollen API | Níveis de pólen por tipo e previsão |
| Google Geocoding API | Conversão de nome de cidade em coordenadas |
| expo-location | GPS do dispositivo e geocodificação reversa |
