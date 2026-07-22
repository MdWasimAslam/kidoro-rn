import React, { useState, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppConfigProvider, useAppConfigContext } from './src/context/AppConfigContext';
import AppNavigator from './src/navigation/AppNavigator';
import MaintenanceScreen from './src/components/MaintenanceScreen';

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
        <StatusBar style="auto" />
        {children}
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppConfigProvider>
          <AppShell>
            <AppNavigator />
          </AppShell>
        </AppConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
