import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import PlaylistCard from '../components/PlaylistCard';

const playlists = [
  { id: '1', name: 'Learning Fun', count: 12, icon: 'school' },
  { id: '2', name: 'Math Adventures', count: 8, icon: 'calculator' },
  { id: '3', name: 'English ABC', count: 10, icon: 'alpha-a-circle' },
  { id: '4', name: 'Space Explorers', count: 6, icon: 'rocket' },
  { id: '5', name: 'Dinosaur World', count: 7, icon: 'dragon' },
  { id: '6', name: 'Amazing Animals', count: 9, icon: 'paw' },
  { id: '7', name: 'Islamic Stories', count: 5, icon: 'mosque' },
  { id: '8', name: 'Science Lab', count: 11, icon: 'flask' },
  { id: '9', name: 'History Time', count: 6, icon: 'castle' },
  { id: '10', name: 'Cartoon Fun', count: 15, icon: 'television' },
];

const PlaylistsScreen = React.memo(function PlaylistsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: SIZES.lg, paddingVertical: SIZES.lg,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: colors.text, ...TYPOGRAPHY.h2 },
  }), [colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlists</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: SIZES.md, paddingBottom: 100 }}>
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
});

export default PlaylistsScreen;
