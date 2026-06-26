export interface GWTemperatureDTO {
  degrees?: number;
  unit?: string;
}

export interface GWCurrentConditionsDTO {
  timeZone?: { id?: string; version?: string };
  temperature?: GWTemperatureDTO;
  feelsLikeTemperature?: GWTemperatureDTO;
  dewPoint?: GWTemperatureDTO;
  heatIndex?: GWTemperatureDTO;
  windChill?: GWTemperatureDTO;
  humidity?: { relativeHumidity?: number };
  precipitation?: {
    probability?: { type?: string; percent?: number };
    qpf?: { quantity?: number; unit?: string };
  };
  weatherCondition?: {
    iconBaseUri?: string;
    description?: { text?: string; languageCode?: string };
    type?: string;
  };
  airPressure?: { meanSeaLevelMillibars?: number };
  visibility?: { distance?: number; unit?: string };
  uvIndex?: number;
  isDaytime?: boolean;
}

export interface GWForecastDayDTO {
  displayDate?: { year?: number; month?: number; day?: number };
  maxTemperature?: GWTemperatureDTO;
  minTemperature?: GWTemperatureDTO;
  weatherCondition?: {
    iconBaseUri?: string;
    type?: string;
    description?: { text?: string; languageCode?: string };
  };
  daytimeForecast?: {
    weatherCondition?: {
      iconBaseUri?: string;
      type?: string;
      description?: { text?: string; languageCode?: string };
    };
  };
  nighttimeForecast?: {
    weatherCondition?: {
      iconBaseUri?: string;
      type?: string;
    };
  };
}

export interface GWForecastResponseDTO {
  forecastDays?: GWForecastDayDTO[];
}

export interface AQForecastHourDTO {
  dateTime?: string;
  indexes?: Array<{
    code?: string;
    aqi?: number;
    category?: string;
  }>;
}

export interface AQForecastResponseDTO {
  hourlyForecasts?: AQForecastHourDTO[];
}
