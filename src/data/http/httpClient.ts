import axios, { AxiosInstance } from 'axios';

function addErrorLogger(client: AxiosInstance, label: string) {
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status;
      const body   = JSON.stringify(err.response?.data ?? {});
      console.error(`[${label}] ${status ?? 'NETWORK'} — ${err.config?.url}\n${body}`);
      return Promise.reject(err);
    },
  );
}

export const googleGeocodingClient = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode',
  timeout: 10000,
});
addErrorLogger(googleGeocodingClient, 'GeocodingAPI');

export const googleAirQualityClient = axios.create({
  baseURL: 'https://airquality.googleapis.com/v1',
  timeout: 12000,
});
addErrorLogger(googleAirQualityClient, 'AirQualityAPI');

export const googlePollenClient = axios.create({
  baseURL: 'https://pollen.googleapis.com/v1',
  timeout: 12000,
});
addErrorLogger(googlePollenClient, 'PollenAPI');

export const googleWeatherClient = axios.create({
  baseURL: 'https://weather.googleapis.com/v1',
  timeout: 12000,
});
addErrorLogger(googleWeatherClient, 'WeatherAPI');
