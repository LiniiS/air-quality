import { AirQualityStatus } from './AirQuality';

export interface ForecastDay {
  label: string;
  temperature: number;
  airStatus: AirQualityStatus;
  date: string;
  weatherType?: string;
}

export interface Weather {
  currentTemperature: number;
  city: string;
  forecast: ForecastDay[];
}
