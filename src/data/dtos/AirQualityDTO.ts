export interface AirQualityIndexDTO {
  code?: string;
  displayName?: string;
  aqi?: number;
  aqiDisplay?: string;
  category?: string;
  dominantPollutant?: string;
  color?: { red?: number; green?: number; blue?: number };
}

export interface AirQualityResponseDTO {
  dateTime?: string;
  regionCode?: string;
  indexes?: AirQualityIndexDTO[];
}
