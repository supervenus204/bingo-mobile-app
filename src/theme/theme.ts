import {COLORS} from './colors';

// Primary theme for React Native Elements UI
export const primaryTheme = {
  colors: {
    primary: COLORS.primary.main,
    secondary: COLORS.primary.light,
    background: COLORS.white,
    white: COLORS.white,
    black: COLORS.black,
    grey0: COLORS.gray.veryLight,
    grey1: COLORS.gray.light,
    grey2: COLORS.gray.lightMedium,
    grey3: COLORS.gray.medium,
    grey4: COLORS.gray.mediumDark,
    grey5: COLORS.gray.dark,
    greyOutline: COLORS.gray.lightMedium,
    searchBg: COLORS.gray.veryLight,
    success: COLORS.primary.green.mantis,
    error: COLORS.primary.pink.bright_1,
    warning: COLORS.secondary.yellow.mustard,
    disabled: COLORS.gray.medium,
    platform: {
      ios: {
        primary: COLORS.primary.main,
        secondary: COLORS.primary.light,
        grey: COLORS.gray.medium,
        searchBg: COLORS.gray.veryLight,
        success: COLORS.primary.green.mantis,
        error: COLORS.primary.pink.bright_1,
        warning: COLORS.secondary.yellow.mustard,
      },
      android: {
        primary: COLORS.primary.main,
        secondary: COLORS.primary.light,
        grey: COLORS.gray.medium,
        searchBg: COLORS.gray.veryLight,
        success: COLORS.primary.green.mantis,
        error: COLORS.primary.pink.bright_1,
        warning: COLORS.secondary.yellow.mustard,
      },
      web: {
        primary: COLORS.primary.main,
        secondary: COLORS.primary.light,
        grey: COLORS.gray.medium,
        searchBg: COLORS.gray.veryLight,
        success: COLORS.primary.green.mantis,
        error: COLORS.primary.pink.bright_1,
        warning: COLORS.secondary.yellow.mustard,
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
};

// Secondary theme for React Native Elements UI
export const secondaryTheme = {
  colors: {
    primary: COLORS.secondary.main,
    secondary: COLORS.secondary.light,
    background: COLORS.white,
    white: COLORS.white,
    black: COLORS.black,
    grey0: COLORS.gray.veryLight,
    grey1: COLORS.gray.light,
    grey2: COLORS.gray.lightMedium,
    grey3: COLORS.gray.medium,
    grey4: COLORS.gray.mediumDark,
    grey5: COLORS.gray.dark,
    greyOutline: COLORS.gray.lightMedium,
    searchBg: COLORS.gray.veryLight,
    success: COLORS.secondary.yellow.mustard,
    error: COLORS.secondary.orange.web,
    warning: COLORS.secondary.yellow.naples,
    disabled: COLORS.gray.medium,
    platform: {
      ios: {
        primary: COLORS.secondary.main,
        secondary: COLORS.secondary.light,
        grey: COLORS.gray.medium,
        searchBg: COLORS.gray.veryLight,
        success: COLORS.secondary.yellow.mustard,
        error: COLORS.secondary.orange.web,
        warning: COLORS.secondary.yellow.naples,
      },
      android: {
        primary: COLORS.secondary.main,
        secondary: COLORS.secondary.light,
        grey: COLORS.gray.medium,
        searchBg: COLORS.gray.veryLight,
        success: COLORS.secondary.yellow.mustard,
        error: COLORS.secondary.orange.web,
        warning: COLORS.secondary.yellow.naples,
      },
      web: {
        primary: COLORS.secondary.main,
        secondary: COLORS.secondary.light,
        grey: COLORS.gray.medium,
        searchBg: COLORS.gray.veryLight,
        success: COLORS.secondary.yellow.mustard,
        error: COLORS.secondary.orange.web,
        warning: COLORS.secondary.yellow.naples,
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
};

// Default theme (primary)
export const defaultTheme = primaryTheme;

// Theme switching function
export const getTheme = (themeName: 'primary' | 'secondary') => {
  return themeName === 'primary' ? primaryTheme : secondaryTheme;
};

// Export all themes
export const themes = {
  primary: primaryTheme,
  secondary: secondaryTheme,
  default: defaultTheme,
};
