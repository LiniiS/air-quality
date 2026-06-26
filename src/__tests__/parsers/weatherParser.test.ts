import { parseGoogleWeather } from '../../data/parsers/weatherParser';
import { GWCurrentConditionsDTO, GWForecastResponseDTO } from '../../data/dtos/WeatherDTO';

function makeCurrentDTO(temp: number): GWCurrentConditionsDTO {
  return { temperature: { degrees: temp } };
}

function makeForecastDTO(
  days: Array<{ year: number; month: number; day: number; maxTemp: number; weatherType?: string }>,
): GWForecastResponseDTO {
  return {
    forecastDays: days.map((d) => ({
      displayDate: { year: d.year, month: d.month, day: d.day },
      maxTemperature: { degrees: d.maxTemp },
      daytimeForecast: d.weatherType
        ? { weatherCondition: { type: d.weatherType } }
        : undefined,
    })),
  };
}

describe('parseGoogleWeather', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 15));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('arredonda a temperatura atual', () => {
    const result = parseGoogleWeather(
      makeCurrentDTO(22.7),
      makeForecastDTO([{ year: 2024, month: 1, day: 16, maxTemp: 25 }]),
      'São Paulo',
    );
    expect(result.currentTemperature).toBe(23);
  });

  it('preserva o nome da cidade', () => {
    const result = parseGoogleWeather(makeCurrentDTO(20), makeForecastDTO([]), 'Belo Horizonte');
    expect(result.city).toBe('Belo Horizonte');
  });

  it('exclui hoje e dias passados da previsão', () => {
    const result = parseGoogleWeather(
      makeCurrentDTO(20),
      makeForecastDTO([
        { year: 2024, month: 1, day: 14, maxTemp: 22 },
        { year: 2024, month: 1, day: 15, maxTemp: 23 },
        { year: 2024, month: 1, day: 16, maxTemp: 24 },
      ]),
      'São Paulo',
    );
    expect(result.forecast).toHaveLength(1);
    expect(result.forecast[0].temperature).toBe(24);
  });

  it('respeita o limite de maxDays', () => {
    const result = parseGoogleWeather(
      makeCurrentDTO(20),
      makeForecastDTO([
        { year: 2024, month: 1, day: 16, maxTemp: 24 },
        { year: 2024, month: 1, day: 17, maxTemp: 25 },
        { year: 2024, month: 1, day: 18, maxTemp: 26 },
        { year: 2024, month: 1, day: 19, maxTemp: 27 },
      ]),
      'São Paulo',
      2,
    );
    expect(result.forecast).toHaveLength(2);
  });

  it('extrai weatherType de daytimeForecast', () => {
    const result = parseGoogleWeather(
      makeCurrentDTO(20),
      makeForecastDTO([{ year: 2024, month: 1, day: 16, maxTemp: 24, weatherType: 'SUNNY' }]),
      'São Paulo',
    );
    expect(result.forecast[0].weatherType).toBe('SUNNY');
  });

  it('usa weatherCondition raiz como fallback de weatherType', () => {
    const forecast: GWForecastResponseDTO = {
      forecastDays: [{
        displayDate: { year: 2024, month: 1, day: 16 },
        maxTemperature: { degrees: 24 },
        weatherCondition: { type: 'CLOUDY' },
      }],
    };
    const result = parseGoogleWeather(makeCurrentDTO(20), forecast, 'São Paulo');
    expect(result.forecast[0].weatherType).toBe('CLOUDY');
  });

  it('define airStatus como Desconhecido quando não há previsão de QA', () => {
    const result = parseGoogleWeather(
      makeCurrentDTO(20),
      makeForecastDTO([{ year: 2024, month: 1, day: 16, maxTemp: 24 }]),
      'São Paulo',
    );
    expect(result.forecast[0].airStatus).toBe('Desconhecido');
  });

  it('mapeia UAQI do forecast de QA para airStatus correto', () => {
    const aqForecast = {
      hourlyForecasts: [
        { dateTime: '2024-01-16T12:00:00Z', indexes: [{ code: 'uaqi', aqi: 70 }] },
        { dateTime: '2024-01-17T12:00:00Z', indexes: [{ code: 'uaqi', aqi: 45 }] },
        { dateTime: '2024-01-18T12:00:00Z', indexes: [{ code: 'uaqi', aqi: 20 }] },
      ],
    };
    const result = parseGoogleWeather(
      makeCurrentDTO(20),
      makeForecastDTO([
        { year: 2024, month: 1, day: 16, maxTemp: 24 },
        { year: 2024, month: 1, day: 17, maxTemp: 25 },
        { year: 2024, month: 1, day: 18, maxTemp: 26 },
      ]),
      'São Paulo',
      3,
      aqForecast,
    );
    expect(result.forecast[0].airStatus).toBe('Seguro');
    expect(result.forecast[1].airStatus).toBe('Atenção');
    expect(result.forecast[2].airStatus).toBe('Perigo');
  });

  it('atribui o label Amanhã ao próximo dia', () => {
    const result = parseGoogleWeather(
      makeCurrentDTO(20),
      makeForecastDTO([{ year: 2024, month: 1, day: 16, maxTemp: 24 }]),
      'São Paulo',
    );
    expect(result.forecast[0].label).toBe('Amanhã');
  });

  it('retorna previsão vazia quando forecastDays está vazio', () => {
    const result = parseGoogleWeather(makeCurrentDTO(22), { forecastDays: [] }, 'Curitiba');
    expect(result.forecast).toHaveLength(0);
    expect(result.currentTemperature).toBe(22);
  });
});
