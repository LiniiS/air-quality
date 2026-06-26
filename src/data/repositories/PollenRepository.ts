import { IPollenRepository } from '../../domain/repositories/IPollenRepository';
import { Pollen } from '../../domain/entities/Pollen';
import { googlePollenClient } from '../http/httpClient';
import { parsePollenResponse } from '../parsers/pollenParser';
import { GOOGLE_MAPS_API_KEY } from '../../config/keys';
import { PollenResponseDTO } from '../dtos/PollenDTO';

export class PollenRepository implements IPollenRepository {
  async getCurrentPollen(latitude: number, longitude: number): Promise<Pollen> {
    const response = await googlePollenClient.get<PollenResponseDTO>('/forecast:lookup', {
      params: {
        key: GOOGLE_MAPS_API_KEY,
        'location.latitude': latitude,
        'location.longitude': longitude,
        days: 5,
      },
    });
    return parsePollenResponse(response.data);
  }
}
