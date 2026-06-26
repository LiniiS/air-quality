import { AirQuality } from '../entities/AirQuality';

export interface IAirQualityRepository {
  getCurrentAirQuality(latitude: number, longitude: number): Promise<AirQuality>;
}
