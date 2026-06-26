import { googleGeocodingClient } from '../http/httpClient';
import { GOOGLE_MAPS_API_KEY } from '../../config/keys';

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponseDTO {
  status: string;
  results: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
}

export class GeocodingRepository {
  async geocodeCity(query: string): Promise<GeocodingResult | null> {
    const res = await googleGeocodingClient.get<GeocodingResponseDTO>('/json', {
      params: {
        address:  query,
        language: 'pt-BR',
        key:      GOOGLE_MAPS_API_KEY,
      },
    });

    if (res.data.status !== 'OK' || !res.data.results.length) return null;

    const first = res.data.results[0];
    return {
      name:      first.formatted_address,
      latitude:  first.geometry.location.lat,
      longitude: first.geometry.location.lng,
    };
  }
}
