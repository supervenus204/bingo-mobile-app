import {ThemeProvider as RNThemeProvider} from '@rneui/themed';
import React, {createContext, ReactNode, useContext, useMemo} from 'react';
import {useCurrentTheme, useThemeActions, useThemeColors} from '../store/theme.store';
import {getTheme} from '../theme';

interface ThemeContextType {
  currentTheme: string;
  colors: ReturnType<typeof useThemeColors>;
  rneuiTheme: ReturnType<typeof getTheme>;
  themeActions: ReturnType<typeof useThemeActions>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const currentTheme = useCurrentTheme();
  const colors = useThemeColors();
  const rneuiTheme = getTheme(currentTheme);
  const themeActions = useThemeActions();

  const contextValue: ThemeContextType = useMemo(
    () => ({
      currentTheme,
      colors,
      rneuiTheme,
      themeActions,
    }),
    [currentTheme, colors, rneuiTheme, themeActions],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <RNThemeProvider theme={rneuiTheme}>{children}</RNThemeProvider>
    </ThemeContext.Provider>
  );
};
