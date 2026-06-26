export type PollenLevel = 'Baixo' | 'Moderado' | 'Alto' | 'Em monitoramento';

export interface PollenTypeEntry {
  code: string;
  name: string;
  inSeason: boolean;
  level: PollenLevel;
}

export interface PollenForecastDay {
  date: string;
  label: string;
  level: PollenLevel;
  types: PollenTypeEntry[];
}

export interface Pollen {
  level: PollenLevel;
  dominantType?: string;
  types: PollenTypeEntry[];
  recommendations: string[];
  forecast: PollenForecastDay[];
}
