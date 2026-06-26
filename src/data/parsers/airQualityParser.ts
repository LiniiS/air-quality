import { AirQuality, AirQualityStatus } from '../../domain/entities/AirQuality';
import { AirQualityResponseDTO } from '../dtos/AirQualityDTO';

function mapUaqiToStatus(uaqi: number): AirQualityStatus {
  if (uaqi >= 60) return 'Seguro';
  if (uaqi >= 40) return 'Atenção';
  return 'Perigo';
}

function getDescription(status: AirQualityStatus): string {
  switch (status) {
    case 'Seguro':
      return 'O ar está limpo e seguro para todas as atividades ao ar livre.';
    case 'Atenção':
      return 'O ar está aceitável. Se você tem sensibilidade respiratória, evite grandes esforços ao ar livre.';
    case 'Perigo':
      return 'Qualidade do ar perigosa. Evite atividades ao ar livre e mantenha janelas fechadas.';
    default:
      return 'Não foi possível determinar a qualidade do ar.';
  }
}

export function parseAirQualityResponse(dto: AirQualityResponseDTO): AirQuality {
  const uaqiIndex = dto.indexes?.find((i) => i.code === 'uaqi');
  const aqi = uaqiIndex?.aqi;

  if (aqi == null || aqi < 0) {
    return {
      status: 'Desconhecido',
      description: 'Não foi possível determinar a qualidade do ar.',
      uaqi: 0,
    };
  }

  const status = mapUaqiToStatus(aqi);
  return { status, description: getDescription(status), uaqi: aqi };
}
