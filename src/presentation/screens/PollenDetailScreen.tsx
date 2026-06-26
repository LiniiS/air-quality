import React from 'react';
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
import { useEnvironmentStore } from '../store/environmentStore';
import { colors } from '../theme/colors';
import { PollenLevel, PollenTypeEntry, PollenForecastDay } from '../../domain/entities/Pollen';

function typeIcon(
  code: string,
): React.ComponentProps<typeof MaterialIcons>['name'] {
  switch (code) {
    case 'GRASS': return 'eco';
    case 'TREE':  return 'park';
    case 'WEED':  return 'local-florist';
    default:      return 'eco';
  }
}

function levelColor(level: PollenLevel): string {
  switch (level) {
    case 'Baixo':           return colors.action;
    case 'Moderado':        return colors.warning;
    case 'Alto':            return colors.danger;
    case 'Em monitoramento': return colors.secondary;
  }
}

function levelLabel(level: PollenLevel): string {
  if (level === 'Em monitoramento') return 'Em monitoramento';
  return `Nível ${level}`;
}

function TypeRow({ entry, last }: { entry: PollenTypeEntry; last: boolean }) {
  const color = levelColor(entry.level);
  return (
    <View
      style={[styles.typeRow, last && styles.rowLast]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${entry.name}: ${entry.inSeason ? 'em temporada' : 'fora de temporada'}, ${levelLabel(entry.level)}`}
    >
      <View style={styles.typeIconWrap}>
        <MaterialIcons name={typeIcon(entry.code)} size={20} color={colors.primary} accessible={false} />
      </View>
      <View style={styles.typeInfo}>
        <Text style={styles.typeName} accessible={false}>{entry.name}</Text>
        <Text style={styles.typeSeason} accessible={false}>
          {entry.inSeason ? 'Em temporada' : 'Fora de temporada'}
        </Text>
      </View>
      <Text style={[styles.typeLevel, { color }]} accessible={false}>
        {levelLabel(entry.level)}
      </Text>
    </View>
  );
}

function ForecastRow({ day, last }: { day: PollenForecastDay; last: boolean }) {
  const color = levelColor(day.level);
  return (
    <View
      style={[styles.forecastRow, last && styles.rowLast]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${day.label}: ${levelLabel(day.level)}`}
    >
      <Text style={styles.forecastLabel} accessible={false}>{day.label}</Text>
      <Text style={[styles.forecastLevel, { color }]} accessible={false}>
        {levelLabel(day.level)}
      </Text>
    </View>
  );
}

export function PollenDetailScreen() {
  const navigation = useNavigation();
  const { pollen } = useEnvironmentStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
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
            Qualidade do Pólen
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Tipos de pólen monitorados na sua região.
        </Text>

        {!pollen ? (
          <Text style={styles.empty}>Dados de pólen indisponíveis.</Text>
        ) : (
          <>
            {/* Hoje */}
            <Text style={styles.sectionTitle}>Hoje</Text>
            <View style={styles.card}>
              {pollen.types.length > 0 ? (
                pollen.types.map((entry, i) => (
                  <TypeRow
                    key={entry.code}
                    entry={entry}
                    last={i === pollen.types.length - 1}
                  />
                ))
              ) : (
                <Text style={styles.noData}>
                  Nenhum tipo de pólen identificado para hoje.
                </Text>
              )}
            </View>

            {/* Próximos dias */}
            {pollen.forecast.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Próximos dias</Text>
                <View style={styles.card}>
                  {pollen.forecast.map((day, i) => (
                    <ForecastRow
                      key={day.date}
                      day={day}
                      last={i === pollen.forecast.length - 1}
                    />
                  ))}
                </View>
              </>
            )}

            {/* Recomendações */}
            {pollen.recommendations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recomendações</Text>
                <View style={styles.card}>
                  {pollen.recommendations.map((rec, i) => (
                    <View
                      key={i}
                      style={[styles.recRow, i === pollen.recommendations.length - 1 && styles.rowLast]}
                    >
                      <MaterialIcons
                        name="info-outline"
                        size={16}
                        color={colors.warning}
                        accessible={false}
                      />
                      <Text style={styles.recText} accessible={false}>{rec}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.note}>
              Dados fornecidos pela Google Pollen API.{'\n'}Cobertura e índices variam por região e temporada.
            </Text>
          </>
        )}
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
  title: { fontSize: 28, fontWeight: '900', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.secondary, marginBottom: 24, lineHeight: 20 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
    marginTop: 8,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },

  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  typeIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  typeInfo:   { flex: 1 },
  typeName:   { fontSize: 15, fontWeight: '700', color: colors.primary },
  typeSeason: { fontSize: 12, color: colors.secondary, marginTop: 2 },
  typeLevel:  { fontSize: 13, fontWeight: '600' },

  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  forecastLabel: { fontSize: 15, fontWeight: '700', color: colors.primary },
  forecastLevel: { fontSize: 13, fontWeight: '600' },

  recRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  recText: { flex: 1, fontSize: 13, color: colors.primary, lineHeight: 18 },

  rowLast:  { borderBottomWidth: 0 },
  noData:   { padding: 16, color: colors.secondary, fontSize: 14 },
  empty:    { padding: 24, textAlign: 'center', color: colors.secondary },
  note: {
    fontSize: 11,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
});
