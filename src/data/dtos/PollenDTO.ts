export interface PollenIndexInfoDTO {
  code?: string;
  displayName?: string;
  value?: number;
  category?: string;
  indexDescription?: string;
}

export interface PollenTypeInfoDTO {
  code?: string;
  displayName?: string;
  inSeason?: boolean;
  indexInfo?: PollenIndexInfoDTO;
  healthRecommendations?: string[];
}

export interface PlantDescriptionDTO {
  type?: string;
  family?: string;
  season?: string;
  specialColors?: string;
  specialShapes?: string;
}

export interface PollenPlantInfoDTO {
  code?: string;
  displayName?: string;
  inSeason?: boolean;
  indexInfo?: PollenIndexInfoDTO;
  plantDescription?: PlantDescriptionDTO;
}

export interface PollenDailyInfoDTO {
  date?: { year?: number; month?: number; day?: number };
  pollenTypeInfo?: PollenTypeInfoDTO[];
  plantInfo?: PollenPlantInfoDTO[];
}

export interface PollenResponseDTO {
  regionCode?: string;
  dailyInfo?: PollenDailyInfoDTO[];
}
