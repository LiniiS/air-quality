import { create } from 'zustand';
import { AirQuality } from '../../domain/entities/AirQuality';
import { Pollen } from '../../domain/entities/Pollen';
import { Weather } from '../../domain/entities/Weather';

interface EnvironmentState {
  airQuality: AirQuality | null;
  pollen: Pollen | null;
  weather: Weather | null;
  loading: boolean;
  error: string | null;
  setAirQuality: (v: AirQuality) => void;
  setPollen: (v: Pollen) => void;
  setWeather: (v: Weather) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  airQuality: null,
  pollen: null,
  weather: null,
  loading: false,
  error: null,
  setAirQuality: (airQuality) => set({ airQuality }),
  setPollen: (pollen) => set({ pollen }),
  setWeather: (weather) => set({ weather }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
