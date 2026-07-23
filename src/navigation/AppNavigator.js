import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import SplashScreen from '../screens/SplashScreen';
import AccessCodeScreen from '../screens/AccessCodeScreen';
import BottomTabs from './BottomTabs';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import GamesScreen from '../screens/GamesScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = React.memo(function AppNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AccessCode" component={AccessCodeScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="Playlists" component={PlaylistsScreen} />
        <Stack.Screen name="Games" component={GamesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default AppNavigator;
