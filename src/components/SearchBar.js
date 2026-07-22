import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, ELEVATION } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const SearchBar = React.memo(function SearchBar({ onSearch, onVoicePress, placeholder }) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = React.useRef(null);

  const styles = useMemo(() => StyleSheet.create({
    wrapper: { paddingHorizontal: SIZES.lg, paddingVertical: SIZES.sm },
    container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: SIZES.radiusMd, paddingHorizontal: SIZES.md, height: 52, borderWidth: 1.5, borderColor: colors.border, ...ELEVATION.level1 },
    containerFocused: { borderColor: colors.primary, backgroundColor: colors.card, ...ELEVATION.level2 },
    searchIcon: { marginRight: SIZES.sm },
    input: { flex: 1, color: colors.text, ...TYPOGRAPHY.body, height: '100%', paddingVertical: 0 },
    actionBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: SIZES.xs },
  }), [colors]);

  const handleChange = (text) => { setQuery(text); onSearch && onSearch(text); };
  const handleClear = () => { setQuery(''); onSearch && onSearch(''); inputRef.current?.focus(); };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, focused && styles.containerFocused]}>
        <MaterialCommunityIcons name="magnify" size={22} color={focused ? colors.primary : colors.textSecondary} style={styles.searchIcon} />
        <TextInput ref={inputRef} style={styles.input} placeholder={placeholder || 'Search videos...'} placeholderTextColor={colors.textMuted} value={query} onChangeText={handleChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} returnKeyType="search" accessibilityLabel="Search videos" />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.actionBtn} accessibilityLabel="Clear search" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onVoicePress} style={styles.actionBtn} accessibilityLabel="Voice search" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons name="microphone" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default SearchBar;
