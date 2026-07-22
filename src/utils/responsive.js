import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 600;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;
  const isLandscape = width > height;
  const orientation = isLandscape ? 'landscape' : 'portrait';

  const imageColumns = isTablet ? (isLandscape ? 4 : 3) : 2;

  return { width, height, isTablet, isLandscape, orientation, imageColumns };
}

export function useCardSizes() {
  const { width, isTablet, isLandscape } = useResponsive();

  let columns = isTablet ? (isLandscape ? 4 : 3) : 2;
  const horizontalPadding = isTablet ? 32 : 24;
  const gap = isTablet ? 12 : 8;
  const cardWidth = (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;
  const cardHeight = cardWidth * 0.5625;

  return { cardWidth, cardHeight, gap, horizontalPadding };
}
