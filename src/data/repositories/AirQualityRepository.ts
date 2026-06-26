import { IAirQualityRepository } from '../../domain/repositories/IAirQualityRepository';
import { AirQuality } from '../../domain/entities/AirQuality';
import { googleAirQualityClient } from '../http/httpClient';
import { parseAirQualityResponse } from '../parsers/airQualityParser';
import { GOOGLE_MAPS_API_KEY } from '../../config/keys';
import { AirQualityResponseDTO } from '../dtos/AirQualityDTO';

export class AirQualityRepository implements IAirQualityRepository {
  async getCurrentAirQuality(latitude: number, longitude: number): Promise<AirQuality> {
    const response = await googleAirQualityClient.post<AirQualityResponseDTO>(
      `/currentConditions:lookup?key=${GOOGLE_MAPS_API_KEY}`,
      {
        location: { latitude, longitude },
        universalAqi: true,
        extraComputations: [],
      },
    );
    return parseAirQualityResponse(response.data);
  }
}
