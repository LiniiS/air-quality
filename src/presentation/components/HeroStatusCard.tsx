import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AirQuality, AirQualityStatus } from '../../domain/entities/AirQuality';
import { colors } from '../theme/colors';

interface Props {
  airQuality: AirQuality;
}

function statusColor(status: AirQualityStatus): string {
  switch (status) {
    case 'Seguro':  return colors.action;
    case 'Atenção': return colors.warning;
    case 'Perigo':  return colors.danger;
    default:        return colors.secondary;
  }
}

function alertIconName(
  status: AirQualityStatus,
): React.ComponentProps<typeof MaterialIcons>['name'] {
  switch (status) {
    case 'Perigo':  return 'error';
    case 'Atenção': return 'warning';
    default:        return 'info';
  }
}

function alertLabel(status: AirQualityStatus): string {
  switch (status) {
    case 'Seguro':  return 'Ar seguro para atividades';
    case 'Atenção': return 'Atenção: Qualidade moderada';
    case 'Perigo':  return 'Perigo: Qualidade perigosa';
    default:        return 'Qualidade desconhecida';
  }
}

export function HeroStatusCard({ airQuality }: Props) {
  const color = statusColor(airQuality.status);

  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Qualidade do ar: ${airQuality.status}. ${airQuality.description}`}
    >
      {/* Gauge circular */}
      <View style={[styles.circle, { borderColor: color }]}>
        <MaterialIcons name="air" size={52} color={color} accessible={false} />
        <Text style={[styles.statusText, { color }]} accessible={false}>
          {airQuality.status.toUpperCase()}
        </Text>
      </View>

      {/* Pílula de alerta */}
      <View
        style={[styles.alertPill, { borderColor: color }]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={alertLabel(airQuality.status)}
      >
        <MaterialIcons
          name={alertIconName(airQuality.status)}
          size={16}
          color={color}
          accessible={false}
        />
        <Text style={[styles.alertText, { color }]} accessible={false}>
          {alertLabel(airQuality.status)}
        </Text>
      </View>

      {/* Descrição */}
      <Text
        style={styles.description}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={airQuality.description}
      >
        {airQuality.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  circle: {
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 21,
    opacity: 0.75,
  },
});
