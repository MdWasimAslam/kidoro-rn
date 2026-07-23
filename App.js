import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ContinueWatchingProvider } from './src/context/ContinueWatchingContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppConfigProvider, useAppConfigContext } from './src/context/AppConfigContext';
import AppNavigator from './src/navigation/AppNavigator';
import MaintenanceScreen from './src/components/MaintenanceScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

function AppShell({ children }) {
  const { config } = useAppConfigContext();

  if (config.maintenance.enabled) {
    return <MaintenanceScreen message={config.maintenance.message} />;
  }

  const configColors = useMemo(() => ({
    primaryColor: config.theme.primaryColor || null,
    secondaryColor: config.theme.secondaryColor || null,
    accentColor: config.theme.accentColor || null,
  }), [config.theme]);

  return (
    <ThemeProvider configColors={configColors}>
      <FavoritesProvider>
        <ContinueWatchingProvider>
          <StatusBar style="auto" />
          {children}
        </ContinueWatchingProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

function FontLoader({ children }) {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text style={{ marginTop: 16, fontSize: 14, color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  return children;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <FontLoader>
            <AppConfigProvider>
              <AppShell>
                <AppNavigator />
              </AppShell>
            </AppConfigProvider>
          </FontLoader>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
