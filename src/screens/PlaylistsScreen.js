import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import PlaylistCard from '../components/PlaylistCard';

import playlistService from '../services/playlist.service';

const PlaylistsScreen = React.memo(function PlaylistsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, statusBarStyle } = useTheme();
  const [playlists, setPlaylists] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    playlistService.getPlaylists().then(data => {
      if (mounted && data) {
        const formatted = data.map((p, i) => ({
          id: p.id || String(i),
          name: p.name || 'Playlist',
          count: p.playlist_videos?.length || 0,
          icon: 'play-box-multiple-outline',
        }));
        setPlaylists(formatted);
      }
    });
    return () => { mounted = false; };
  }, []);

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
          <PlaylistCard key={playlist.id} playlist={playlist} onPress={() => {
            if (playlist.count > 0) {
              Alert.alert(playlist.name, `${playlist.count} videos in this playlist`);
            }
          }} />
        ))}
      </ScrollView>
    </View>
  );
});

export default PlaylistsScreen;
