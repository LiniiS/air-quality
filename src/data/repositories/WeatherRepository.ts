import { IWeatherRepository } from '../../domain/repositories/IWeatherRepository';
import { Weather } from '../../domain/entities/Weather';
import { googleWeatherClient } from '../http/httpClient';
import { parseGoogleWeather } from '../parsers/weatherParser';
import { GOOGLE_MAPS_API_KEY } from '../../config/keys';
import {
  GWCurrentConditionsDTO,
  GWForecastResponseDTO,
} from '../dtos/WeatherDTO';

export class WeatherRepository implements IWeatherRepository {
  async getWeatherAndForecast(latitude: number, longitude: number, city: string, maxDays = 3): Promise<Weather> {
    const locationParams = {
      key: GOOGLE_MAPS_API_KEY,
      'location.latitude': latitude,
      'location.longitude': longitude,
      unitsSystem: 'METRIC',
    };

    const [currentRes, forecastRes] = await Promise.all([
      googleWeatherClient.get<GWCurrentConditionsDTO>('/currentConditions:lookup', {
        params: locationParams,
      }),
      googleWeatherClient.get<GWForecastResponseDTO>('/forecast/days:lookup', {
        params: { ...locationParams, days: 5 },
      }),
    ]);

    return parseGoogleWeather(currentRes.data, forecastRes.data, city, maxDays);
  }
}
