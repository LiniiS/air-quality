import { Pollen } from '../entities/Pollen';

export interface IPollenRepository {
  getCurrentPollen(latitude: number, longitude: number): Promise<Pollen>;
}
