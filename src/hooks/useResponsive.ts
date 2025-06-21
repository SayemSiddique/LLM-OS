import { useMediaQuery } from './useMediaQuery';
import { useState, useEffect } from 'react';

/**
 * Responsive utilities and hooks for the LLM-OS
 */

// Breakpoint definitions (matching Tailwind CSS)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Custom responsive hooks
export const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeScreen = useMediaQuery('(min-width: 1280px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    // Helper to get current screen size category
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large',
    // Touch device detection (approximation)
    isTouchDevice: isMobile || isTablet,
  };
};

// Responsive spacing utility
export const getResponsiveSpacing = (mobile: string, tablet?: string, desktop?: string) => {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return mobile;
  if (isTablet && tablet) return tablet;
  return desktop || tablet || mobile;
};

// Responsive padding classes
export const responsivePadding = {
  sm: 'p-2 sm:p-3 lg:p-4',
  md: 'p-3 sm:p-4 lg:p-6',
  lg: 'p-4 sm:p-6 lg:p-8',
  xl: 'p-6 sm:p-8 lg:p-12',
};

// Responsive margin classes
export const responsiveMargin = {
  sm: 'm-2 sm:m-3 lg:m-4',
  md: 'm-3 sm:m-4 lg:m-6',
  lg: 'm-4 sm:m-6 lg:m-8',
  xl: 'm-6 sm:m-8 lg:m-12',
};

// Responsive text size classes
export const responsiveText = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-sm sm:text-base lg:text-lg',
  lg: 'text-base sm:text-lg lg:text-xl',
  xl: 'text-lg sm:text-xl lg:text-2xl',
  '2xl': 'text-xl sm:text-2xl lg:text-3xl',
  '3xl': 'text-2xl sm:text-3xl lg:text-4xl',
};

// Responsive spacing for flex containers
export const responsiveSpacing = {
  xs: 'space-x-1 sm:space-x-2',
  sm: 'space-x-2 sm:space-x-3',
  md: 'space-x-3 sm:space-x-4',
  lg: 'space-x-4 sm:space-x-6',
};

// Responsive grid columns
export const responsiveGrid = {
  '1-2': 'grid-cols-1 sm:grid-cols-2',
  '1-2-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '1-2-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '2-3-4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  '1-3-4': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
};

// Safe area utilities for mobile devices
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'CSS' in window && 'supports' in window.CSS) {
      const updateSafeArea = () => {
        // Check if safe area insets are supported
        if (window.CSS.supports('padding-top', 'env(safe-area-inset-top)')) {
          const computedStyle = getComputedStyle(document.documentElement);
          setSafeArea({
            top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
            bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
            left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
            right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
          });
        }
      };

      updateSafeArea();
      window.addEventListener('resize', updateSafeArea);
      window.addEventListener('orientationchange', updateSafeArea);

      return () => {
        window.removeEventListener('resize', updateSafeArea);
        window.removeEventListener('orientationchange', updateSafeArea);
      };
    }
  }, []);

  return safeArea;
};

// Responsive button sizes
export const responsiveButtonSizes = {
  sm: 'px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm',
  md: 'px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base',
  lg: 'px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg',
};

// Touch-friendly sizing for interactive elements
export const touchFriendly = {
  minHeight: 'min-h-[44px]', // Apple's recommended minimum touch target
  minWidth: 'min-w-[44px]',
  button: 'min-h-[44px] min-w-[44px] px-4 py-2 sm:px-6 sm:py-3',
  icon: 'w-5 h-5 sm:w-6 sm:h-6', // Larger icons on touch devices
};

// Responsive icon sizes
export const responsiveIconSizes = {
  xs: 'w-3 h-3 sm:w-4 sm:h-4',
  sm: 'w-4 h-4 sm:w-5 sm:h-5',
  md: 'w-5 h-5 sm:w-6 sm:h-6',
  lg: 'w-6 h-6 sm:w-8 sm:h-8',
  xl: 'w-8 h-8 sm:w-10 sm:h-10',
};

// Container max-widths for different screen sizes
export const responsiveContainers = {
  sm: 'max-w-sm sm:max-w-md lg:max-w-lg',
  md: 'max-w-md sm:max-w-lg lg:max-w-xl',
  lg: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
  xl: 'max-w-xl sm:max-w-2xl lg:max-w-4xl',
  full: 'max-w-full',
};
