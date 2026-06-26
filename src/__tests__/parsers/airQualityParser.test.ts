import { parseAirQualityResponse } from '../../data/parsers/airQualityParser';

describe('parseAirQualityResponse', () => {
  it('classifica UAQI >= 60 como Seguro', () => {
    const result = parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 75 }] });
    expect(result.status).toBe('Seguro');
    expect(result.uaqi).toBe(75);
  });

  it('classifica UAQI >= 40 e < 60 como Atenção', () => {
    const result = parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 50 }] });
    expect(result.status).toBe('Atenção');
    expect(result.uaqi).toBe(50);
  });

  it('classifica UAQI < 40 como Perigo', () => {
    const result = parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 20 }] });
    expect(result.status).toBe('Perigo');
    expect(result.uaqi).toBe(20);
  });

  it('retorna Desconhecido quando indexes está vazio', () => {
    const result = parseAirQualityResponse({ indexes: [] });
    expect(result.status).toBe('Desconhecido');
    expect(result.uaqi).toBe(0);
  });

  it('retorna Desconhecido quando o índice uaqi está ausente', () => {
    const result = parseAirQualityResponse({ indexes: [{ code: 'outro', aqi: 80 }] });
    expect(result.status).toBe('Desconhecido');
  });

  it('retorna Desconhecido quando aqi é negativo', () => {
    const result = parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: -1 }] });
    expect(result.status).toBe('Desconhecido');
  });

  it('retorna Desconhecido quando o DTO não tem indexes', () => {
    const result = parseAirQualityResponse({});
    expect(result.status).toBe('Desconhecido');
    expect(result.uaqi).toBe(0);
  });

  it('inclui descrição não vazia para cada status', () => {
    const resultados = [
      parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 75 }] }),
      parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 50 }] }),
      parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 20 }] }),
    ];
    resultados.forEach((r) => expect(r.description.length).toBeGreaterThan(0));
  });

  it('usa o valor exato de 40 como Atenção (boundary)', () => {
    expect(parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 40 }] }).status).toBe('Atenção');
  });

  it('usa o valor exato de 60 como Seguro (boundary)', () => {
    expect(parseAirQualityResponse({ indexes: [{ code: 'uaqi', aqi: 60 }] }).status).toBe('Seguro');
  });
});
