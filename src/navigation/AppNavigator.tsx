import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DashboardScreen }    from '../presentation/screens/DashboardScreen';
import { ForecastScreen }     from '../presentation/screens/ForecastScreen';
import { PollenDetailScreen } from '../presentation/screens/PollenDetailScreen';
import { TripPlannerScreen }  from '../presentation/screens/TripPlannerScreen';

export type RootStackParamList = {
  Dashboard:    undefined;
  Forecast:     undefined;
  PollenDetail: undefined;
  TripPlanner:  undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Dashboard"    component={DashboardScreen} />
          <Stack.Screen name="Forecast"     component={ForecastScreen} />
          <Stack.Screen name="PollenDetail" component={PollenDetailScreen} />
          <Stack.Screen name="TripPlanner"  component={TripPlannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
