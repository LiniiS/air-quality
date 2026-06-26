import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEnvironmentStore } from '../store/environmentStore';
import { useEnvironmentData } from '../hooks/useEnvironmentData';
import { HeroStatusCard } from '../components/HeroStatusCard';
import { PollenBadge } from '../components/PollenBadge';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { airQuality, pollen, weather, loading, error } = useEnvironmentStore();
  const { fetchData } = useEnvironmentData();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  if (!airQuality || !pollen || !weather) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Localização */}
        <View
          style={styles.locationRow}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Localização atual: ${weather.city}`}
        >
          <MaterialIcons
            name="location-on"
            size={16}
            color={colors.primary}
            accessible={false}
          />
          <Text style={styles.locationText} accessible={false}>
            {weather.city}
          </Text>
        </View>

        {/* Título */}
        <Text
          style={styles.heading}
          accessible={true}
          accessibilityRole="header"
        >
          Como está o ar{'\n'}agora?
        </Text>

        {/* Temperatura */}
        <Text
          style={styles.temperature}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Temperatura atual: ${weather.currentTemperature} graus Celsius`}
        >
          {weather.currentTemperature}°
        </Text>

        {/* Card principal */}
        <View style={styles.cardWrap}>
          <HeroStatusCard airQuality={airQuality} />
        </View>

        {/* Badge de pólen — navega para detalhes */}
        <View style={styles.pollenWrap}>
          <PollenBadge
            pollen={pollen}
            onPress={() => navigation.navigate('PollenDetail')}
          />
        </View>

        {/* Botão de previsão */}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => navigation.navigate('Forecast')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Ver previsão para os próximos dias"
          accessibilityHint="Navega para a tela de previsão dos próximos três dias"
        >
          <Text style={styles.ctaText}>Ver previsão para os próximos dias</Text>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color={colors.white}
            accessible={false}
          />
        </Pressable>

        {/* Botão de planejamento de viagem */}
        <Pressable
          style={({ pressed }) => [styles.ctaSecondary, pressed && styles.ctaPressed]}
          onPress={() => navigation.navigate('TripPlanner')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Planejar viagem"
          accessibilityHint="Consulte temperatura e qualidade do ar em qualquer destino"
        >
          <MaterialIcons
            name="pin-drop"
            size={20}
            color={colors.action}
            accessible={false}
          />
          <Text style={styles.ctaSecondaryText}>Planejar viagem</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  heading: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primary,
    lineHeight: 40,
    marginBottom: 6,
  },
  temperature: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 20,
  },
  cardWrap: { marginBottom: 16 },
  pollenWrap: { marginBottom: 28 },
  cta: {
    backgroundColor: colors.action,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  ctaPressed: { opacity: 0.82 },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSecondary: {
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.action,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    marginTop: 12,
  },
  ctaSecondaryText: {
    color: colors.action,
    fontSize: 16,
    fontWeight: '700',
  },
});
