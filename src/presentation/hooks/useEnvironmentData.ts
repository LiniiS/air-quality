import { useCallback } from 'react';
import * as Location from 'expo-location';
import { useEnvironmentStore } from '../store/environmentStore';
import { AirQualityRepository } from '../../data/repositories/AirQualityRepository';
import { PollenRepository } from '../../data/repositories/PollenRepository';
import { WeatherRepository } from '../../data/repositories/WeatherRepository';
import { GOOGLE_MAPS_API_KEY } from '../../config/keys';

const airQualityRepo = new AirQualityRepository();
const pollenRepo     = new PollenRepository();
const weatherRepo    = new WeatherRepository();

function friendlyMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('timeout')) {
      return 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
    }
    if (msg.includes('401') || msg.includes('403') || msg.includes('api key')) {
      return 'Chave de API inválida ou sem permissão. Verifique as configurações.';
    }
    if (msg.includes('404')) {
      return 'Serviço indisponível para a sua região no momento.';
    }
    if (msg.includes('429')) {
      return 'Limite de requisições atingido. Tente novamente em alguns minutos.';
    }
  }
  return 'Não foi possível carregar os dados do ambiente agora.';
}

export function useEnvironmentData() {
  const { setAirQuality, setPollen, setWeather, setLoading, setError } =
    useEnvironmentStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('[AirQuality] Chave EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ausente. Reinicie com: npx expo start -c');
      setError('Configuração incompleta. Reinicie o app com npx expo start -c');
      setLoading(false);
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setError('Permissão de localização negada. Habilite o GPS para monitorar o ar da sua região.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      let city = 'Sua localização';
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        const cityName = place?.city || place?.subregion || place?.district;
        city = [cityName, place?.region].filter(Boolean).join(', ') || city;
      } catch {
      }

      const [airQualityResult, pollenResult, weatherResult] = await Promise.allSettled([
        airQualityRepo.getCurrentAirQuality(latitude, longitude),
        pollenRepo.getCurrentPollen(latitude, longitude),
        weatherRepo.getWeatherAndForecast(latitude, longitude, city),
      ]);

      if (airQualityResult.status === 'rejected') {
        console.error('[AirQuality] Air Quality API:', airQualityResult.reason);
      }
      if (pollenResult.status === 'rejected') {
        console.warn('[AirQuality] Pollen API (não fatal):', pollenResult.reason?.message ?? pollenResult.reason);
      }
      if (weatherResult.status === 'rejected') {
        console.error('[AirQuality] Weather API:', weatherResult.reason);
      }

      if (airQualityResult.status === 'rejected' || weatherResult.status === 'rejected') {
        const mainError =
          airQualityResult.status === 'rejected' ? airQualityResult.reason
          : weatherResult.status  === 'rejected' ? weatherResult.reason
          : new Error('unknown');
        setError(friendlyMessage(mainError));
        return;
      }

      setAirQuality(airQualityResult.value);
      setWeather(weatherResult.value);
      setPollen(
        pollenResult.status === 'fulfilled'
          ? pollenResult.value
          : { level: 'Em monitoramento', types: [], recommendations: [], forecast: [] },
      );
    } catch (err) {
      console.error('[AirQuality] Erro inesperado:', err);
      setError(friendlyMessage(err));
    } finally {
      setLoading(false);
    }
  }, [setAirQuality, setPollen, setWeather, setLoading, setError]);

  return { fetchData };
}
