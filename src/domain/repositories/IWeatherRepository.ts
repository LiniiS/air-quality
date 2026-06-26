import { Weather } from '../entities/Weather';

export interface IWeatherRepository {
  getWeatherAndForecast(latitude: number, longitude: number, city: string, maxDays?: number): Promise<Weather>;
}
