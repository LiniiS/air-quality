import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${message}. Verifique sua conexão e tente novamente.`}
    >
      <View style={styles.iconWrap}>
        <MaterialIcons
          name="cloud-off"
          size={64}
          color={colors.secondary}
          accessible={false}
        />
      </View>

      <Text
        style={styles.message}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={message}
      >
        {message}
      </Text>

      <Text style={styles.hint} accessible={true} accessibilityRole="text">
        Verifique sua conexão e tente novamente em alguns instantes.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onRetry}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Tentar Novamente"
        accessibilityHint="Toca para recarregar os dados ambientais"
      >
        <MaterialIcons name="refresh" size={20} color={colors.white} accessible={false} />
        <Text style={styles.buttonText}>Tentar Novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrap: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  message: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  hint: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.action,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
    width: '100%',
  },
  buttonPressed: { opacity: 0.82 },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
