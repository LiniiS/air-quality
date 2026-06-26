import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Pollen, PollenLevel } from '../../domain/entities/Pollen';
import { colors } from '../theme/colors';

interface Props {
  pollen: Pollen;
  onPress?: () => void;
}

function levelColor(level: PollenLevel): string {
  switch (level) {
    case 'Baixo':            return colors.action;
    case 'Moderado':         return colors.warning;
    case 'Alto':             return colors.danger;
    case 'Em monitoramento': return colors.secondary;
  }
}

export function PollenBadge({ pollen, onPress }: Props) {
  const color = levelColor(pollen.level);
  const levelText = pollen.level === 'Em monitoramento'
    ? 'Em monitoramento'
    : `Nível ${pollen.level}`;

  const a11yLabel = `Pólen: ${levelText}${
    pollen.dominantType ? `. Tipo predominante: ${pollen.dominantType}` : ''
  }. Toque para ver previsão.`;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Abre a tela de qualidade do pólen"
    >
      <View style={styles.iconWrap}>
        <MaterialIcons
          name="local-florist"
          size={22}
          color={colors.primary}
          accessible={false}
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.typeLabel} accessible={false}>Pólen</Text>
        <Text style={[styles.levelText, { color }]} accessible={false}>
          {levelText}
        </Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={22}
        color={colors.secondary}
        accessible={false}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: { opacity: 0.82 },
  iconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  typeLabel: {
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 2,
  },
  levelText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
