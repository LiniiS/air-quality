import { Weather, ForecastDay } from '../../domain/entities/Weather';
import { AirQualityStatus } from '../../domain/entities/AirQuality';
import {
  GWCurrentConditionsDTO,
  GWForecastResponseDTO,
  AQForecastResponseDTO,
} from '../dtos/WeatherDTO';

function mapUaqiToStatus(uaqi: number): AirQualityStatus {
  if (uaqi >= 60) return 'Seguro';
  if (uaqi >= 40) return 'Atenção';
  return 'Perigo';
}

function localDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function toDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const today    = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth()    === tomorrow.getMonth() &&
    date.getDate()     === tomorrow.getDate()
  ) {
    return 'Amanhã';
  }

  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
}

export function parseGoogleWeather(
  current:    GWCurrentConditionsDTO,
  forecast:   GWForecastResponseDTO,
  city:       string,
  maxDays:    number = 3,
  aqForecast: AQForecastResponseDTO = {},
): Weather {
  const currentTemp = Math.round(current.temperature?.degrees ?? 0);

  const aqByDay = new Map<string, number>();
  for (const hour of aqForecast.hourlyForecasts ?? []) {
    if (!hour.dateTime) continue;
    const dt      = new Date(hour.dateTime);
    const dateStr = localDateStr(dt);
    if (aqByDay.has(dateStr)) continue;
    const uaqi = hour.indexes?.find((i) => i.code === 'uaqi')?.aqi;
    if (uaqi != null) aqByDay.set(dateStr, uaqi);
  }

  const todayStr    = localDateStr(new Date());
  const forecastDays: ForecastDay[] = [];

  for (const day of forecast.forecastDays ?? []) {
    const { year, month, day: d } = day.displayDate ?? {};
    if (!year || !month || !d) continue;

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (dateStr <= todayStr) continue;
    if (forecastDays.length >= maxDays) break;

    const maxTemp    = Math.round(day.maxTemperature?.degrees ?? 0);
    const uaqi       = aqByDay.get(dateStr);
    const airStatus: AirQualityStatus = uaqi != null ? mapUaqiToStatus(uaqi) : 'Desconhecido';

    const weatherType =
      day.daytimeForecast?.weatherCondition?.type ??
      day.weatherCondition?.type;

    forecastDays.push({ label: toDayLabel(dateStr), temperature: maxTemp, airStatus, date: dateStr, weatherType });
  }

  return { currentTemperature: currentTemp, city, forecast: forecastDays };
}
