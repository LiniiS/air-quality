import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEnvironmentStore } from '../store/environmentStore';
import { colors } from '../theme/colors';
import { AirQuality, AirQualityStatus } from '../../domain/entities/AirQuality';
import { ForecastDay } from '../../domain/entities/Weather';

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function weatherIcon(type?: string): MCIName {
  switch (type) {
    case 'SUNNY':
    case 'CLEAR':               return 'weather-sunny';
    case 'MOSTLY_SUNNY':
    case 'MOSTLY_CLEAR':
    case 'PARTLY_CLOUDY':       return 'weather-partly-cloudy';
    case 'MOSTLY_CLOUDY':
    case 'OVERCAST':
    case 'CLOUDY':              return 'weather-cloudy';
    case 'FOGGY':
    case 'HAZY':                return 'weather-fog';
    case 'WINDY':               return 'weather-windy';
    case 'DRIZZLE':
    case 'LIGHT_RAIN':
    case 'RAIN':
    case 'MODERATE_RAIN':       return 'weather-rainy';
    case 'HEAVY_RAIN':          return 'weather-pouring';
    case 'THUNDERSTORM':        return 'weather-lightning-rainy';
    case 'SNOW':
    case 'LIGHT_SNOW':          return 'weather-snowy';
    case 'HEAVY_SNOW':
    case 'BLIZZARD':            return 'weather-snowy-heavy';
    case 'SLEET':               return 'weather-snowy-rainy';
    case 'HAIL':                return 'weather-hail';
    default:                    return 'weather-cloudy';
  }
}

function aqColor(status: AirQualityStatus): string {
  switch (status) {
    case 'Seguro':  return colors.action;
    case 'Atenção': return colors.warning;
    case 'Perigo':  return colors.danger;
    default:        return colors.secondary;
  }
}

function aqIconName(status: AirQualityStatus): React.ComponentProps<typeof MaterialIcons>['name'] {
  switch (status) {
    case 'Seguro':  return 'check-circle';
    case 'Atenção': return 'warning';
    case 'Perigo':  return 'error';
    default:        return 'help-outline';
  }
}

function aqLabel(status: AirQualityStatus): string {
  switch (status) {
    case 'Seguro':  return 'Ar seguro';
    case 'Atenção': return 'Qualidade moderada';
    case 'Perigo':  return 'Qualidade perigosa';
    default:        return 'Sem dados';
  }
}

function TemperatureRow({ day, last }: { day: ForecastDay; last: boolean }) {
  return (
    <View
      style={[styles.row, last && styles.rowLast]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${day.label}: ${day.temperature} graus Celsius`}
    >
      <View style={styles.weatherIconWrap}>
        <MaterialCommunityIcons
          name={weatherIcon(day.weatherType)}
          size={28}
          color={colors.secondary}
          accessible={false}
        />
      </View>
      <Text style={styles.dayLabel} accessible={false}>{day.label}</Text>
      <Text style={styles.tempText} accessible={false}>{day.temperature}°</Text>
    </View>
  );
}

function AirQualityRow({ day, last }: { day: ForecastDay; last: boolean }) {
  const color = aqColor(day.airStatus);
  return (
    <View
      style={[styles.row, last && styles.rowLast]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${day.label}: qualidade do ar — ${aqLabel(day.airStatus)}`}
    >
      <View style={[styles.aqIconWrap, { borderColor: color }]}>
        <MaterialIcons name={aqIconName(day.airStatus)} size={20} color={color} accessible={false} />
      </View>
      <Text style={styles.dayLabel} accessible={false}>{day.label}</Text>
      <Text style={[styles.aqStatusText, { color }]} accessible={false}>
        {aqLabel(day.airStatus)}
      </Text>
    </View>
  );
}

function CurrentAQCard({ aq }: { aq: AirQuality }) {
  const color = aqColor(aq.status);
  return (
    <View
      style={styles.aqCardInner}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Qualidade do ar: ${aqLabel(aq.status)}, índice ${aq.uaqi}`}
    >
      <View style={styles.aqCardHeader}>
        <View style={[styles.aqIconWrap, { borderColor: color }]}>
          <MaterialIcons name={aqIconName(aq.status)} size={20} color={color} accessible={false} />
        </View>
        <Text style={[styles.aqStatusLabel, { color }]} accessible={false}>
          {aqLabel(aq.status)}
        </Text>
        <View style={[styles.uaqiBadge, { borderColor: color }]}>
          <Text style={[styles.uaqiText, { color }]} accessible={false}>UAQI {aq.uaqi}</Text>
        </View>
      </View>
      <Text style={styles.aqDescription} accessible={false}>{aq.description}</Text>
      <Text style={styles.aqNote} accessible={false}>
        Condição atual · Previsão diária de qualidade do ar indisponível para sua região.
      </Text>
    </View>
  );
}

export function ForecastScreen() {
  const navigation = useNavigation();
  const { weather, airQuality } = useEnvironmentStore();

  const forecast = weather?.forecast ?? [];
  const hasAnyAQ = forecast.some((d) => d.airStatus !== 'Desconhecido');

  function subtitle(): string {
    if (hasAnyAQ)   return 'Previsão de temperatura e qualidade do ar.';
    if (airQuality) return 'Previsão de temperatura. Qualidade do ar exibe a condição atual da sua região.';
    return 'Exibindo somente temperatura. Dados de qualidade do ar não disponíveis para sua região.';
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
            onPress={() => navigation.goBack()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Voltar para o painel principal"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} accessible={false} />
          </Pressable>
          <Text style={styles.title} accessible={true} accessibilityRole="header">
            Próximos dias
          </Text>
        </View>

        <Text style={styles.subtitle}>{subtitle()}</Text>

        <Text style={styles.sectionTitle} accessible={true} accessibilityRole="header">
          Temperatura
        </Text>
        <View style={styles.card}>
          {forecast.length > 0 ? (
            forecast.map((day, i) => (
              <TemperatureRow key={day.date} day={day} last={i === forecast.length - 1} />
            ))
          ) : (
            <Text style={styles.emptyText}>Previsão indisponível no momento.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle} accessible={true} accessibilityRole="header">
          Qualidade do Ar
        </Text>
        <View style={styles.card}>
          {hasAnyAQ ? (
            forecast.map((day, i) => (
              <AirQualityRow key={day.date} day={day} last={i === forecast.length - 1} />
            ))
          ) : airQuality ? (
            <CurrentAQCard aq={airQuality} />
          ) : (
            <View
              style={styles.unavailableRow}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Dados de qualidade do ar não disponíveis para sua região no momento."
            >
              <MaterialIcons name="info-outline" size={20} color={colors.secondary} accessible={false} />
              <Text style={styles.unavailableText} accessible={false}>
                Dados de qualidade do ar não estão disponíveis para sua região no momento.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 32, paddingBottom: 48 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  backPressed: { opacity: 0.7 },
  title:    { fontSize: 30, fontWeight: '900', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.secondary, marginBottom: 24, lineHeight: 20 },

  sectionTitle: {
    fontSize: 15, fontWeight: '800', color: colors.primary,
    marginBottom: 10, marginTop: 8,
  },

  card: {
    backgroundColor: colors.white, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    marginBottom: 8, overflow: 'hidden',
  },

  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
    borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  rowLast: { borderBottomWidth: 0 },

  weatherIconWrap: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },

  aqIconWrap: {
    width: 42, height: 42, borderRadius: 21, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background,
  },

  dayLabel:     { flex: 1, fontSize: 16, fontWeight: '700', color: colors.primary },
  tempText:     { fontSize: 26, fontWeight: '900', color: colors.primary },
  aqStatusText: { fontSize: 13, fontWeight: '600' },

  aqCardInner:  { padding: 16 },
  aqCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  aqStatusLabel:{ flex: 1, fontSize: 15, fontWeight: '700' },
  uaqiBadge:    { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  uaqiText:     { fontSize: 12, fontWeight: '700' },
  aqDescription:{ fontSize: 13, color: colors.primary, lineHeight: 18, marginBottom: 8 },
  aqNote:       { fontSize: 11, color: colors.secondary, lineHeight: 16 },

  unavailableRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16,
  },
  unavailableText: { flex: 1, fontSize: 13, color: colors.secondary, lineHeight: 18 },

  emptyText: { padding: 16, color: colors.secondary, fontSize: 14 },
});
