import { parsePollenResponse } from '../../data/parsers/pollenParser';

const HOJE = '2024-01-15';
const AMANHA = '2024-01-16';
const DEPOIS = '2024-01-17';
const ONTEM = '2024-01-14';

function makeDay(dateStr: string, upiValue: number, extraRecs: string[] = []) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return {
    date: { year, month, day },
    pollenTypeInfo: [
      {
        code: 'GRASS',
        displayName: 'Grass',
        inSeason: true,
        indexInfo: { value: upiValue },
        healthRecommendations: [`Recomendação para ${dateStr}`, ...extraRecs],
      },
    ],
  };
}

describe('parsePollenResponse', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 15));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retorna Em monitoramento para resposta vazia', () => {
    const result = parsePollenResponse({});
    expect(result.level).toBe('Em monitoramento');
    expect(result.types).toHaveLength(0);
    expect(result.forecast).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it('extrai dados de hoje como level/types raiz', () => {
    const result = parsePollenResponse({ dailyInfo: [makeDay(HOJE, 4)] });
    expect(result.level).toBe('Moderado');
    expect(result.types).toHaveLength(1);
    expect(result.types[0].name).toBe('Gramíneas');
    expect(result.types[0].inSeason).toBe(true);
  });

  it('coloca dias futuros no forecast', () => {
    const result = parsePollenResponse({
      dailyInfo: [makeDay(AMANHA, 5), makeDay(DEPOIS, 1)],
    });
    expect(result.forecast).toHaveLength(2);
    expect(result.forecast[0].level).toBe('Alto');
    expect(result.forecast[1].level).toBe('Baixo');
  });

  it('ignora dias passados', () => {
    const result = parsePollenResponse({ dailyInfo: [makeDay(ONTEM, 5)] });
    expect(result.level).toBe('Em monitoramento');
    expect(result.forecast).toHaveLength(0);
  });

  it('limita o forecast a 3 dias futuros', () => {
    const result = parsePollenResponse({
      dailyInfo: [
        makeDay('2024-01-16', 3),
        makeDay('2024-01-17', 3),
        makeDay('2024-01-18', 3),
        makeDay('2024-01-19', 3),
      ],
    });
    expect(result.forecast).toHaveLength(3);
  });

  it('deduplica recomendações de saúde', () => {
    const result = parsePollenResponse({
      dailyInfo: [
        {
          date: { year: 2024, month: 1, day: 15 },
          pollenTypeInfo: [
            { code: 'GRASS', inSeason: true, indexInfo: { value: 3 }, healthRecommendations: ['Use máscara', 'Evite parques'] },
            { code: 'TREE',  inSeason: true, indexInfo: { value: 2 }, healthRecommendations: ['Use máscara'] },
          ],
        },
      ],
    });
    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations).toContain('Use máscara');
    expect(result.recommendations).toContain('Evite parques');
  });

  it('mapeia valores UPI para níveis corretos', () => {
    expect(parsePollenResponse({ dailyInfo: [makeDay(HOJE, 0)] }).level).toBe('Baixo');
    expect(parsePollenResponse({ dailyInfo: [makeDay(HOJE, 2)] }).level).toBe('Baixo');
    expect(parsePollenResponse({ dailyInfo: [makeDay(HOJE, 3)] }).level).toBe('Moderado');
    expect(parsePollenResponse({ dailyInfo: [makeDay(HOJE, 4)] }).level).toBe('Moderado');
    expect(parsePollenResponse({ dailyInfo: [makeDay(HOJE, 5)] }).level).toBe('Alto');
  });

  it('mapeia códigos de tipo para nomes em português', () => {
    const result = parsePollenResponse({
      dailyInfo: [{
        date: { year: 2024, month: 1, day: 15 },
        pollenTypeInfo: [
          { code: 'GRASS', inSeason: true, indexInfo: { value: 1 } },
          { code: 'TREE',  inSeason: true, indexInfo: { value: 1 } },
          { code: 'WEED',  inSeason: true, indexInfo: { value: 1 } },
        ],
      }],
    });
    const names = result.types.map((t) => t.name);
    expect(names).toContain('Gramíneas');
    expect(names).toContain('Árvores');
    expect(names).toContain('Ervas daninhas');
  });

  it('identifica o tipo dominante como o de maior UPI', () => {
    const result = parsePollenResponse({
      dailyInfo: [{
        date: { year: 2024, month: 1, day: 15 },
        pollenTypeInfo: [
          { code: 'GRASS', inSeason: true, indexInfo: { value: 2 } },
          { code: 'TREE',  inSeason: true, indexInfo: { value: 5 } },
        ],
      }],
    });
    expect(result.dominantType).toBe('Árvores');
  });
});
