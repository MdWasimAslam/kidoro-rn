const COLORS = {
  primary: '#FF4D4D',
  primaryLight: '#FF7A7A',
  primaryDark: '#CC3B3B',
  primaryAlpha10: 'rgba(255, 77, 77, 0.10)',
  primaryAlpha20: 'rgba(255, 77, 77, 0.20)',

  secondary: '#FFD93D',
  secondaryLight: '#FFE470',
  secondaryDark: '#D4B232',

  blue: '#4DA8FF',
  blueLight: '#7ABFFF',
  blueDark: '#3A86CC',
  blueAlpha15: 'rgba(77, 168, 255, 0.15)',

  green: '#5CD65C',
  greenLight: '#7AE07A',
  greenDark: '#3DAB3D',
  greenAlpha15: 'rgba(92, 214, 92, 0.15)',

  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  purpleDark: '#6D3AE0',
  purpleAlpha15: 'rgba(139, 92, 246, 0.15)',

  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#F8F9FA',
  surfaceDark: '#1E1E1E',
  card: '#FFFFFF',
  cardDark: '#2A2A2A',

  text: '#121212',
  textDark: '#FFFFFF',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  textMuted: '#9CA3AF',

  border: '#E5E7EB',
  borderDark: '#374151',
  error: '#EF4444',
  errorAlpha10: 'rgba(239, 68, 68, 0.10)',
  success: '#10B981',
  warning: '#F59E0B',

  overlay: 'rgba(0, 0, 0, 0.50)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.08)',
  shimmer: '#E1E9EE',
  shimmerDark: '#3A3A3A',
  shimmerHighlight: '#F2F8FC',
  shimmerHighlightDark: '#4A4A4A',
};

const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
  radius: 24,
  radiusLg: 24,
  radiusMd: 16,
  radiusSm: 8,
  radiusXs: 4,
  icon: 24,
  iconLg: 32,
};

const TYPOGRAPHY = {
  headingXL: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
  headingL: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  headingM: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  headingS: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  h1: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
  h2: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  h4: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 18 },
  labelBold: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
};

const ELEVATION = {
  level0: { shadowColor: 'transparent', elevation: 0 },
  level1: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  level2: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 4 },
  level3: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 20, elevation: 8 },
};

function getTheme({ isDark = false }) {
  if (isDark) {
    return {
      COLORS: { ...COLORS, background: COLORS.backgroundDark, surface: COLORS.surfaceDark, card: COLORS.cardDark, text: COLORS.textDark, textSecondary: COLORS.textSecondaryDark, border: COLORS.borderDark },
      SIZES, TYPOGRAPHY,
    };
  }
  return { COLORS, SIZES, TYPOGRAPHY };
}

module.exports = { COLORS, SIZES, TYPOGRAPHY, ELEVATION, getTheme };
