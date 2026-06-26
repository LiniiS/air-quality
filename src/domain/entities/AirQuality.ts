export type AirQualityStatus = 'Seguro' | 'Atenção' | 'Perigo' | 'Desconhecido';

export interface AirQuality {
  status: AirQualityStatus;
  description: string;
  uaqi: number;
}
