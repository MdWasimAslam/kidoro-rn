import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Image, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { profile } from '../mock/profile';
import { videos } from '../mock/videos';
import { shorts } from '../mock/shorts';
import useStreak from '../hooks/useStreak';
import useYTIcon from '../hooks/useYouTubeMode';

const ACCESS_CODE = '1234';

const BADGE_THRESHOLDS = [1, 3, 7, 14, 21, 30, 50];
function calcBadgeCount(streak) { return BADGE_THRESHOLDS.filter(t => streak >= t).length; }

const TOTAL_VIDEOS = videos.length + shorts.length;

function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme, statusBarStyle } = useTheme();
  const { streak } = useStreak();
  const { showYTIcon, toggleYTIcon, switching } = useYTIcon();

  const badgeCount = useMemo(() => calcBadgeCount(streak), [streak]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: SIZES.lg, paddingVertical: SIZES.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { color: colors.text, ...TYPOGRAPHY.h2 },

    // Profile Card
    profileCard: { marginHorizontal: SIZES.lg, marginTop: SIZES.lg, backgroundColor: colors.card, borderRadius: SIZES.radiusLg, overflow: 'hidden', ...ELEVATION.level2 },
    profileAccent: { height: 4, backgroundColor: colors.primary },
    profileContent: { padding: SIZES.lg },
    profileTopRow: { flexDirection: 'row', alignItems: 'center' },
    avatarWrapper: { position: 'relative', width: 68, height: 68, justifyContent: 'center', alignItems: 'center' },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surface },
    avatarRing: { position: 'absolute', top: -2, left: -2, right: -2, bottom: -2, borderRadius: 34, borderWidth: 2.5, borderColor: colors.primary + '40' },
    onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success, borderWidth: 3, borderColor: colors.card },
    profileNameSection: { flex: 1, marginLeft: SIZES.md },
    profileName: { color: colors.text, fontSize: 22, fontWeight: '700', lineHeight: 28 },
    codeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    codeLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '500', marginLeft: 4 },
    codeValue: { color: colors.primary, fontSize: 15, fontWeight: '800', letterSpacing: 3 },

    // Stats
    statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.lg, paddingTop: SIZES.lg, borderTopWidth: 1, borderTopColor: colors.border },
    statItem: { flex: 1, alignItems: 'center' },
    statIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    statValue: { color: colors.text, fontSize: 18, fontWeight: '800', lineHeight: 24 },
    statLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '500', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    statDivider: { width: 1, height: 40, backgroundColor: colors.border },

    // Group Sections
    group: { marginTop: SIZES.lg, paddingHorizontal: SIZES.lg },
    groupTitle: { color: colors.textSecondary, ...TYPOGRAPHY.captionBold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SIZES.sm, paddingLeft: SIZES.xs },
    groupCard: { backgroundColor: colors.card, borderRadius: SIZES.radiusLg, overflow: 'hidden', ...ELEVATION.level1 },
    item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.lg, paddingVertical: SIZES.md },
    itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    itemIcon: { width: 40, height: 40, borderRadius: SIZES.radiusSm, justifyContent: 'center', alignItems: 'center', marginRight: SIZES.md },
    itemLabel: { color: colors.text, ...TYPOGRAPHY.h4 },
    itemValue: { color: colors.textSecondary, ...TYPOGRAPHY.caption, marginTop: 2 },

    // Dark Mode Toggle
    darkModeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    darkModeLabel: { flex: 1, marginLeft: SIZES.md },
    darkModeTitle: { color: colors.text, ...TYPOGRAPHY.h4 },
    darkModeDesc: { color: colors.textSecondary, ...TYPOGRAPHY.caption, marginTop: 2 },

    // Logout
    logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: SIZES.lg, marginTop: SIZES.xxl, padding: SIZES.lg, borderRadius: SIZES.radiusLg, backgroundColor: colors.error + '10' },
    logoutText: { color: colors.error, ...TYPOGRAPHY.h4, marginLeft: SIZES.sm },

    // Footer
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SIZES.lg },
    footerLogo: { width: 18, height: 18, marginRight: 6, borderRadius: 4 },
    footerText: { color: colors.textSecondary, ...TYPOGRAPHY.caption, textAlign: 'center' },
  }), [colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAccent} />
          <View style={styles.profileContent}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                <View style={styles.avatarRing} />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.profileNameSection}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <View style={styles.codeRow}>
                  <MaterialCommunityIcons name="lock" size={14} color={colors.primary} />
                  <Text style={styles.codeLabel}>Access Code: </Text>
                  <Text style={styles.codeValue}>{ACCESS_CODE}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIconBox, { backgroundColor: colors.primary + '12' }]}>
                  <MaterialCommunityIcons name="fire" size={22} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIconBox, { backgroundColor: colors.blue + '12' }]}>
                  <MaterialCommunityIcons name="play-circle" size={22} color={colors.blue} />
                </View>
                <Text style={styles.statValue}>{TOTAL_VIDEOS}</Text>
                <Text style={styles.statLabel}>Videos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIconBox, { backgroundColor: colors.purple + '12' }]}>
                  <MaterialCommunityIcons name="shield-star" size={22} color={colors.purple} />
                </View>
                <Text style={styles.statValue}>{badgeCount}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </View>
        </View>

        {/* APPEARANCE SECTION */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>APPEARANCE</Text>
          <View style={styles.groupCard}>
            <View style={[styles.item]}>
              <View style={[styles.itemIcon, { backgroundColor: isDark ? colors.purple + '15' : colors.secondary + '15' }]}>
                <MaterialCommunityIcons name={isDark ? 'weather-night' : 'white-balance-sunny'} size={22} color={isDark ? colors.purple : colors.secondaryDark} />
              </View>
              <View style={styles.darkModeLabel}>
                <Text style={styles.darkModeTitle}>Dark Mode</Text>
                <Text style={styles.darkModeDesc}>{isDark ? 'On' : 'Off'}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                thumbColor={isDark ? colors.primary : colors.textSecondary}
              />
            </View>
                    {/* YT Icon Toggle */}
            <View style={[styles.item, styles.itemBorder]}>
              <View style={[styles.itemIcon, { backgroundColor: colors.blue + '15' }]}>
                <MaterialCommunityIcons name="youtube" size={22} color={'#FF0000'} />
              </View>
              <View style={styles.darkModeLabel}>
                <Text style={styles.darkModeTitle}>Enable YT Icon</Text>
                <Text style={styles.darkModeDesc}>{showYTIcon ? 'YouTube play icon shown' : 'Show YouTube play icon in footer'}</Text>
              </View>
              <Switch
                value={showYTIcon}
                onValueChange={toggleYTIcon}
                disabled={switching}
                trackColor={{ false: colors.border, true: '#FF000060' }}
                thumbColor={showYTIcon ? '#FF0000' : colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* INFORMATION SECTION */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>INFORMATION</Text>
          <View style={styles.groupCard}>
            <TouchableOpacity style={styles.item} onPress={() => Alert.alert('About Kidoro', 'Kidoro is a fun learning app for kids. Watch educational videos, nursery rhymes, science experiments, and more. Safe for ages 2–10.\n\nVersion 1.0.0\n\nMade with ❤️ for young learners.')}>
              <View style={[styles.itemIcon, { backgroundColor: colors.blue + '15' }]}>
                <MaterialCommunityIcons name="information" size={22} color={colors.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>About</Text>
                <Text style={styles.itemValue}>Kidoro v1.0.0</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.item, styles.itemBorder]} onPress={() => Alert.alert('Privacy Policy', 'We do not collect personal information from children.\n\nAll favorites and streaks are stored locally on your device only.\n\nNo accounts required.\n\nNo ads. No tracking.\n\nKidoro is a safe space for kids to learn and have fun.')}>
              <View style={[styles.itemIcon, { backgroundColor: colors.purple + '15' }]}>
                <MaterialCommunityIcons name="shield-check" size={22} color={colors.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>Privacy Policy</Text>
                <Text style={styles.itemValue}>Your data stays on device</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.item}>
              <View style={[styles.itemIcon, { backgroundColor: colors.green + '15' }]}>
                <MaterialCommunityIcons name="message-text" size={22} color={colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>Feedback</Text>
                <Text style={styles.itemValue}>help@kidoro.app</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={() => navigation.replace('AccessCode')} accessibilityLabel="Logout">
          <MaterialCommunityIcons name="logout" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Image
            source={showYTIcon ? require('../../assets/icon-youtube.png') : require('../../assets/icon.png')}
            style={styles.footerLogo}
          />
          <Text style={styles.footerText}>Kidoro v1.0.0</Text>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
