# Kidora Design System

## Overview
The Kidora Design System provides a comprehensive framework of color tokens, typography scales, elevation shadows, spacing grids, and component tokens tailored specifically for an engaging, accessible, and premium children's streaming experience.

---

## 1. Color System Tokens

```javascript
const COLORS = {
  // Brand Colors
  primary: '#FF4D4D',         // Energetic Red
  primaryLight: '#FF7A7A',
  primaryDark: '#CC3B3B',
  primaryAlpha10: 'rgba(255, 77, 77, 0.10)',
  primaryAlpha20: 'rgba(255, 77, 77, 0.20)',

  secondary: '#FFD93D',       // Playful Yellow
  secondaryLight: '#FFE470',
  secondaryDark: '#D4B232',

  // Accent Colors
  blue: '#4DA8FF',            // Kid Blue
  blueLight: '#7ABFFF',
  blueDark: '#3A86CC',
  blueAlpha15: 'rgba(77, 168, 255, 0.15)',

  green: '#5CD65C',           // Vibrant Green
  greenLight: '#7AE07A',
  greenDark: '#3DAB3D',
  greenAlpha15: 'rgba(92, 214, 92, 0.15)',

  purple: '#8B5CF6',          // Magic Purple
  purpleLight: '#A78BFA',
  purpleDark: '#6D3AE0',
  purpleAlpha15: 'rgba(139, 92, 246, 0.15)',

  // Neutral Colors
  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#F8F9FA',
  surfaceDark: '#1E1E1E',
  card: '#FFFFFF',
  cardDark: '#2A2A2A',

  // Text Colors
  text: '#121212',
  textDark: '#FFFFFF',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  textMuted: '#9CA3AF',

  // Utility & Feedback
  border: '#E5E7EB',
  borderDark: '#374151',
  error: '#EF4444',
  errorAlpha10: 'rgba(239, 68, 68, 0.10)',
  success: '#10B981',
  warning: '#F59E0B',

  // Overlays & Shimmers
  overlay: 'rgba(0, 0, 0, 0.50)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.08)',
  shimmer: '#E1E9EE',
  shimmerHighlight: '#F2F8FC',
};
```

---

## 2. 8-Point Spacing Grid

All layout dimensions, paddings, and margins follow a strict 8-point spatial rhythm:

| Token Key | Value (px) | Usage |
| :--- | :--- | :--- |
| `SIZES.xs` | 4px | Micro spacing, subtle gaps, dot indicators |
| `SIZES.sm` | 8px | Tight gaps, internal badge padding |
| `SIZES.md` | 12px | Component internal padding, standard card gap |
| `SIZES.lg` | 16px | Standard screen padding, row gutters |
| `SIZES.xl` | 24px | Section spacing, container padding |
| `SIZES.xxl` | 32px | Hero headers, major screen sections |
| `SIZES.huge` | 48px | Minimum touch target bounding box |

---

## 3. Typography Scale

| Style Token | Font Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `headingXL` | 32px | 38px | 800 (Bold) | Hero Screen Greetings |
| `headingL` | 26px | 32px | 700 (Bold) | Screen Titles, Section Headers |
| `headingM` | 20px | 26px | 700 (Bold) | Card Group Titles, Dialog Titles |
| `headingS` | 16px | 22px | 600 (SemiBold)| Video Card Titles |
| `body` | 15px | 22px | 400 (Regular) | Main Body Text |
| `bodyBold` | 15px | 22px | 600 (SemiBold)| Emphasized Body |
| `caption` | 13px | 18px | 400 (Regular) | Meta text, video views, durations |
| `label` | 14px | 18px | 600 (SemiBold)| Buttons, Chips, Tab Bar Labels |

---

## 4. Elevation & Shadow Levels

```javascript
const ELEVATION = {
  level0: {
    shadowColor: 'transparent',
    elevation: 0,
  },
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  level3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
};
```

---

## 5. Corner Radii

- `radiusXs`: 4px (Badges, small tags)
- `radiusSm`: 8px (Small chips, input fields)
- `radiusMd`: 16px (Video cards, search bar)
- `radiusLg`: 24px (Pill buttons, floating navigation)
- `radiusFull`: 9999px (Circular avatars, icon buttons)
