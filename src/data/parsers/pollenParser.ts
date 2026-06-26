import { Pollen, PollenLevel, PollenTypeEntry, PollenForecastDay } from '../../domain/entities/Pollen';
import { PollenResponseDTO, PollenTypeInfoDTO } from '../dtos/PollenDTO';

const TYPE_NAMES: Record<string, string> = {
  GRASS: 'Gramíneas',
  TREE:  'Árvores',
  WEED:  'Ervas daninhas',
};

function mapUpiToLevel(value: number): PollenLevel {
  if (value <= 2) return 'Baixo';
  if (value <= 4) return 'Moderado';
  return 'Alto';
}

function localDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function toDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return 'Amanhã';
  }

  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
}

function parseTypes(typeInfoList: PollenTypeInfoDTO[]): {
  types: PollenTypeEntry[];
  level: PollenLevel;
  dominantType?: string;
  recommendations: string[];
} {
  const types: PollenTypeEntry[] = [];
  const recommendations: string[] = [];
  let maxValue = -1;
  let dominantType: string | undefined;

  for (const typeInfo of typeInfoList) {
    const code = typeInfo.code ?? '';
    const name = TYPE_NAMES[code] ?? typeInfo.displayName ?? code;
    const inSeason = typeInfo.inSeason ?? false;
    const value = typeInfo.indexInfo?.value;
    const level: PollenLevel = value != null ? mapUpiToLevel(value) : 'Em monitoramento';

    for (const rec of typeInfo.healthRecommendations ?? []) {
      if (!recommendations.includes(rec)) recommendations.push(rec);
    }

    if (value != null && value > maxValue) {
      maxValue = value;
      dominantType = name;
    }

    types.push({ code, name, inSeason, level });
  }

  return {
    types,
    level: maxValue >= 0 ? mapUpiToLevel(maxValue) : 'Em monitoramento',
    dominantType,
    recommendations,
  };
}

export function parsePollenResponse(dto: PollenResponseDTO): Pollen {
  const todayStr = localDateStr(new Date());
  const forecast: PollenForecastDay[] = [];

  let todayLevel: PollenLevel = 'Em monitoramento';
  let todayTypes: PollenTypeEntry[] = [];
  let todayDominant: string | undefined;
  let todayRecs: string[] = [];

  for (const dayInfo of dto.dailyInfo ?? []) {
    const { year, month, day } = dayInfo.date ?? {};
    if (!year || !month || !day) continue;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const typeInfoList = dayInfo.pollenTypeInfo ?? [];
    if (typeInfoList.length === 0) continue;

    const parsed = parseTypes(typeInfoList);

    if (dateStr === todayStr) {
      todayLevel    = parsed.level;
      todayTypes    = parsed.types;
      todayDominant = parsed.dominantType;
      todayRecs     = parsed.recommendations;
    } else if (dateStr > todayStr && forecast.length < 3) {
      forecast.push({
        date:  dateStr,
        label: toDayLabel(dateStr),
        level: parsed.level,
        types: parsed.types,
      });
    }
  }

  return {
    level:         todayLevel,
    dominantType:  todayDominant,
    types:         todayTypes,
    recommendations: todayRecs,
    forecast,
  };
}
