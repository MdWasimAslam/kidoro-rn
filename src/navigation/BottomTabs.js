import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import ShortsScreen from '../screens/ShortsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import SearchScreen from '../screens/SearchScreen';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const TabIcon = React.memo(function TabIcon({ name, focused, color }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.08 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.tabItem, { transform: [{ scale: scaleAnim }] }]}>
      <MaterialCommunityIcons name={name} size={28} color={color} />
      {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
    </Animated.View>
  );
});

const BottomTabs = React.memo(function BottomTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72,
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 4,
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          ...ELEVATION.level2,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeStackScreen}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} /> }} />
      <Tab.Screen name="Shorts" component={ShortsScreen}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'play-box-multiple' : 'play-box-multiple-outline'} focused={focused} color={color} /> }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} color={color} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'cog' : 'cog-outline'} focused={focused} color={color} /> }} />
    </Tab.Navigator>
  );
});

export default BottomTabs;

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  activeDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
});
