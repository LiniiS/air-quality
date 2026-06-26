import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GeocodingRepository }   from '../../data/repositories/GeocodingRepository';
import { WeatherRepository }     from '../../data/repositories/WeatherRepository';
import { PollenRepository }      from '../../data/repositories/PollenRepository';
import { AirQualityRepository }  from '../../data/repositories/AirQualityRepository';
import { colors }                from '../theme/colors';
import { AirQuality, AirQualityStatus } from '../../domain/entities/AirQuality';
import { ForecastDay }           from '../../domain/entities/Weather';
import { Pollen, PollenLevel, PollenForecastDay } from '../../domain/entities/Pollen';

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

function aqIcon(status: AirQualityStatus): React.ComponentProps<typeof MaterialIcons>['name'] {
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

function pollenColor(level: PollenLevel): string {
  switch (level) {
    case 'Baixo':    return colors.action;
    case 'Moderado': return colors.warning;
    case 'Alto':     return colors.danger;
    default:         return colors.secondary;
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
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name={weatherIcon(day.weatherType)}
          size={26}
          color={colors.secondary}
          accessible={false}
        />
      </View>
      <Text style={styles.dayLabel} accessible={false}>{day.label}</Text>
      <Text style={styles.tempText} accessible={false}>{day.temperature}°</Text>
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
        <View style={[styles.circleIconWrap, { borderColor: color }]}>
          <MaterialIcons name={aqIcon(aq.status)} size={18} color={color} accessible={false} />
        </View>
        <Text style={[styles.aqStatusLabel, { color }]} accessible={false}>{aqLabel(aq.status)}</Text>
        <View style={[styles.uaqiBadge, { borderColor: color }]}>
          <Text style={[styles.uaqiText, { color }]} accessible={false}>UAQI {aq.uaqi}</Text>
        </View>
      </View>
      <Text style={styles.aqDescription} accessible={false}>{aq.description}</Text>
      <Text style={styles.aqNote} accessible={false}>
        Condição atual · Previsão diária de qualidade do ar indisponível para esta região.
      </Text>
    </View>
  );
}

function PollenRow({ day, last }: { day: PollenForecastDay; last: boolean }) {
  const color = pollenColor(day.level);
  return (
    <View
      style={[styles.row, last && styles.rowLast]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${day.label}: pólen ${day.level}`}
    >
      <View style={[styles.circleIconWrap, { borderColor: color }]}>
        <MaterialIcons name="eco" size={18} color={color} accessible={false} />
      </View>
      <Text style={styles.dayLabel} accessible={false}>{day.label}</Text>
      <Text style={[styles.statusText, { color }]} accessible={false}>{day.level}</Text>
    </View>
  );
}

function UnavailableNotice({ message }: { message: string }) {
  return (
    <View
      style={styles.unavailableRow}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      <MaterialIcons name="info-outline" size={20} color={colors.secondary} accessible={false} />
      <Text style={styles.unavailableText} accessible={false}>{message}</Text>
    </View>
  );
}

const geocodingRepo  = new GeocodingRepository();
const weatherRepo    = new WeatherRepository();
const pollenRepo     = new PollenRepository();
const airQualityRepo = new AirQualityRepository();

type Status = 'idle' | 'loading' | 'error' | 'success';

export function TripPlannerScreen() {
  const navigation = useNavigation();
  const inputRef   = useRef<TextInput>(null);

  const [query,        setQuery]        = useState('');
  const [status,       setStatus]       = useState<Status>('idle');
  const [errorMsg,     setErrorMsg]     = useState('');
  const [locationName, setLocationName] = useState('');
  const [forecast,     setForecast]     = useState<ForecastDay[]>([]);
  const [airQuality,   setAirQuality]   = useState<AirQuality | null>(null);
  const [pollen,       setPollen]       = useState<Pollen | null>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    Keyboard.dismiss();
    setStatus('loading');
    setForecast([]);
    setAirQuality(null);
    setPollen(null);

    try {
      const geocoded = await geocodingRepo.geocodeCity(q);
      if (!geocoded) {
        setErrorMsg('Cidade não encontrada. Verifique o nome e tente novamente.');
        setStatus('error');
        return;
      }

      const [weatherResult, aqResult, pollenResult] = await Promise.allSettled([
        weatherRepo.getWeatherAndForecast(geocoded.latitude, geocoded.longitude, geocoded.name, 5),
        airQualityRepo.getCurrentAirQuality(geocoded.latitude, geocoded.longitude),
        pollenRepo.getCurrentPollen(geocoded.latitude, geocoded.longitude),
      ]);

      if (weatherResult.status === 'rejected') {
        setErrorMsg('Não foi possível carregar os dados climáticos para esta região. Tente novamente.');
        setStatus('error');
        return;
      }

      setLocationName(geocoded.name);
      setForecast(weatherResult.value.forecast);
      setAirQuality(aqResult.status === 'fulfilled' ? aqResult.value : null);
      setPollen(pollenResult.status === 'fulfilled' ? pollenResult.value : null);
      setStatus('success');
    } catch {
      setErrorMsg('Ocorreu um erro inesperado. Tente novamente.');
      setStatus('error');
    }
  };

  const pollenDays   = pollen?.forecast ?? [];
  const hasPollenDay = pollenDays.length > 0;
  const totalDays    = forecast.length;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
              onPress={() => navigation.goBack()}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} accessible={false} />
            </Pressable>
            <Text style={styles.title} accessible={true} accessibilityRole="header">
              Planejar viagem
            </Text>
          </View>

          <Text style={styles.subtitle}>
            Consulte temperatura, qualidade do ar e pólen em qualquer destino.
          </Text>

          <View style={styles.searchCard}>
            <Text style={styles.searchLabel}>Destino</Text>
            <View style={styles.searchRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Digite uma cidade ou região..."
                placeholderTextColor={colors.secondary}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
                accessible={true}
                accessibilityLabel="Campo de busca de cidade"
              />
              <Pressable
                style={({ pressed }) => [styles.searchBtn, pressed && styles.searchBtnPressed]}
                onPress={handleSearch}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Buscar"
              >
                <MaterialIcons name="search" size={22} color={colors.white} accessible={false} />
              </Pressable>
            </View>
          </View>

          {status === 'idle' && (
            <View style={styles.hintCard}>
              <MaterialIcons name="pin-drop" size={32} color={colors.secondary} accessible={false} />
              <Text style={styles.hintText}>
                Busque uma cidade para ver a previsão de temperatura, qualidade do ar e níveis de pólen no seu destino.
              </Text>
            </View>
          )}

          {status === 'loading' && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={colors.action} />
              <Text style={styles.loadingText}>Buscando dados do destino...</Text>
            </View>
          )}

          {status === 'error' && (
            <View style={styles.errorCard}>
              <MaterialIcons name="error-outline" size={24} color={colors.danger} accessible={false} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {status === 'success' && (
            <>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={18} color={colors.action} accessible={false} />
                <Text style={styles.locationName} numberOfLines={2}>{locationName}</Text>
              </View>

              <View style={styles.limitationBadge}>
                <MaterialIcons name="info-outline" size={14} color={colors.secondary} accessible={false} />
                <Text style={styles.limitationText}>
                  Previsão de temperatura para os próximos {totalDays} {totalDays === 1 ? 'dia' : 'dias'}. Disponibilidade de dados pode variar por região.
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Temperatura</Text>
              <View style={styles.card}>
                {forecast.map((day, i) => (
                  <TemperatureRow key={day.date} day={day} last={i === forecast.length - 1} />
                ))}
              </View>

              <Text style={styles.sectionTitle}>Qualidade do Ar</Text>
              <View style={styles.card}>
                {airQuality ? (
                  <CurrentAQCard aq={airQuality} />
                ) : (
                  <UnavailableNotice message="Dados de qualidade do ar não disponíveis para esta região no momento." />
                )}
              </View>

              <Text style={styles.sectionTitle}>Pólen</Text>
              <View style={styles.card}>
                {hasPollenDay ? (
                  pollenDays.map((day, i) => (
                    <PollenRow key={day.date} day={day} last={i === pollenDays.length - 1} />
                  ))
                ) : (
                  <UnavailableNotice message="Dados de pólen não disponíveis para esta região no momento." />
                )}
              </View>

              <Text style={styles.footerNote}>
                Dados fornecidos pela Google Weather, Air Quality e Pollen APIs. As condições podem variar conforme a região e as condições atmosféricas.
              </Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  flex:    { flex: 1 },
  content: { padding: 24, paddingTop: 32, paddingBottom: 56 },

  header:      { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  backBtn:     { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  backPressed: { opacity: 0.7 },
  title:       { fontSize: 28, fontWeight: '900', color: colors.primary },
  subtitle:    { fontSize: 14, color: colors.secondary, marginBottom: 24, lineHeight: 20 },

  searchCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  searchLabel: { fontSize: 12, fontWeight: '700', color: colors.secondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  searchRow:   { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1, height: 46, borderWidth: 1, borderColor: colors.background, borderRadius: 12,
    paddingHorizontal: 14, fontSize: 15, color: colors.primary, backgroundColor: colors.background,
  },
  searchBtn:        { width: 46, height: 46, borderRadius: 12, backgroundColor: colors.action, alignItems: 'center', justifyContent: 'center' },
  searchBtnPressed: { opacity: 0.82 },

  hintCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 28, alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  hintText: { fontSize: 14, color: colors.secondary, textAlign: 'center', lineHeight: 20 },

  loadingWrap: { alignItems: 'center', marginTop: 40, gap: 14 },
  loadingText: { fontSize: 14, color: colors.secondary },
  errorCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  errorText: { flex: 1, fontSize: 14, color: colors.primary, lineHeight: 20 },

  locationRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 8 },
  locationName: { flex: 1, fontSize: 17, fontWeight: '800', color: colors.primary, lineHeight: 22 },

  limitationBadge: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: colors.white, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 20,
  },
  limitationText: { flex: 1, fontSize: 12, color: colors.secondary, lineHeight: 17 },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.primary, marginBottom: 10, marginTop: 8 },

  card: {
    backgroundColor: colors.white, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    marginBottom: 8, overflow: 'hidden',
  },

  row:     { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, borderBottomWidth: 1, borderBottomColor: colors.background },
  rowLast: { borderBottomWidth: 0 },

  iconWrap:       { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  circleIconWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },

  dayLabel:   { flex: 1, fontSize: 15, fontWeight: '700', color: colors.primary },
  tempText:   { fontSize: 24, fontWeight: '900', color: colors.primary },
  statusText: { fontSize: 13, fontWeight: '600' },

  aqCardInner: { padding: 16 },
  aqCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  aqStatusLabel: { flex: 1, fontSize: 15, fontWeight: '700' },
  uaqiBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  uaqiText:  { fontSize: 12, fontWeight: '700' },
  aqDescription: { fontSize: 13, color: colors.primary, lineHeight: 18, marginBottom: 8 },
  aqNote:    { fontSize: 11, color: colors.secondary, lineHeight: 16 },

  unavailableRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16 },
  unavailableText: { flex: 1, fontSize: 13, color: colors.secondary, lineHeight: 18 },

  footerNote: { marginTop: 16, fontSize: 11, color: colors.secondary, textAlign: 'center', lineHeight: 16 },
});
