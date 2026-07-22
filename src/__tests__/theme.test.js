const { COLORS, SIZES, TYPOGRAPHY, ELEVATION } = require('../constants/theme');

describe('Theme Colors', () => {
  test('should have all required colors', () => {
    const required = ['primary', 'secondary', 'blue', 'green', 'purple', 'background', 'backgroundDark', 'text', 'textDark', 'textSecondary', 'error', 'success', 'warning', 'border'];
    required.forEach(color => {
      expect(COLORS[color]).toBeDefined();
      expect(COLORS[color]).toMatch(/^#/);
    });
  });

  test('primary should be #FF4D4D', () => {
    expect(COLORS.primary).toBe('#FF4D4D');
  });

  test('secondary should be #FFD93D', () => {
    expect(COLORS.secondary).toBe('#FFD93D');
  });

  test('background should be #FFFFFF', () => {
    expect(COLORS.background).toBe('#FFFFFF');
  });

  test('dark should be #121212', () => {
    expect(COLORS.backgroundDark).toBe('#121212');
  });
});

describe('Theme Sizes', () => {
  test('should have all required sizes', () => {
    const required = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'huge', 'radius', 'radiusLg', 'radiusMd', 'radiusSm', 'radiusXs'];
    required.forEach(size => {
      expect(SIZES[size]).toBeDefined();
      expect(typeof SIZES[size]).toBe('number');
    });
  });

  test('card radius should be 24', () => {
    expect(SIZES.radius).toBe(24);
  });
});

describe('Theme Fonts', () => {
  test('should have all weight variants', () => {
    expect(TYPOGRAPHY.body.fontWeight).toBe('400');
    expect(TYPOGRAPHY.label.fontWeight).toBe('500');
    expect(TYPOGRAPHY.h4.fontWeight).toBe('600');
    expect(TYPOGRAPHY.h2.fontWeight).toBe('700');
  });
});

describe('Theme Elevation', () => {
  test('should have all elevation levels', () => {
    expect(ELEVATION.level1).toBeDefined();
    expect(ELEVATION.level2).toBeDefined();
    expect(ELEVATION.level3).toBeDefined();
  });

  test('elevation should have shadowColor', () => {
    expect(ELEVATION.level1.shadowColor).toBe('#000');
    expect(ELEVATION.level2.shadowColor).toBe('#000');
    expect(ELEVATION.level3.shadowColor).toBe('#000');
  });
});
