import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: object;
}

function SkeletonBlock({ width = '100%', height, borderRadius = 8, style }: SkeletonBlockProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeletonBase, colors.skeletonHighlight],
  });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor }, style]}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Carregando dados ambientais, aguarde."
    >
      {/* Location row */}
      <SkeletonBlock width={110} height={14} borderRadius={7} style={styles.mb8} />
      {/* Heading */}
      <SkeletonBlock width={220} height={36} borderRadius={8} style={styles.mb4} />
      <SkeletonBlock width={160} height={36} borderRadius={8} style={styles.mb20} />
      {/* Temperature */}
      <SkeletonBlock width={60} height={28} borderRadius={8} style={styles.mb16} />

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.circleWrap}>
          <SkeletonBlock width={160} height={160} borderRadius={80} />
        </View>
        <SkeletonBlock width="88%" height={44} borderRadius={22} style={styles.mt16} />
        <SkeletonBlock width="80%" height={16} borderRadius={8} style={styles.mt12} />
        <SkeletonBlock width="70%" height={14} borderRadius={8} style={styles.mt6} />
      </View>

      {/* Pollen row */}
      <SkeletonBlock width="100%" height={64} borderRadius={16} style={styles.mt16} />

      {/* CTA */}
      <SkeletonBlock width="100%" height={56} borderRadius={28} style={styles.mt24} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 56 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  circleWrap: { alignItems: 'center' },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mt6: { marginTop: 6 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
});
