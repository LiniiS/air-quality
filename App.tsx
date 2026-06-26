import React, { useState, useEffect, useRef, Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/presentation/theme/colors';

class SplashBoundary extends Component<{ onError: () => void; children: ReactNode }> {
  componentDidCatch(error: Error) {
    console.error('[Splash] LottieView erro de render:', error.message);
    this.props.onError();
  }
  render() {
    return this.props.children;
  }
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSplashDone(true);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(advance, 8000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!splashDone) {
    return (
      <View style={styles.container}>
        <SplashBoundary onError={advance}>
          <LottieView
            source={require('./assets/splash-animation.json')}
            autoPlay
            loop={false}
            onAnimationFinish={advance}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </SplashBoundary>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
