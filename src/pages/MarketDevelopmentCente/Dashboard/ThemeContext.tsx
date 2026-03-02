import React, { createContext, useContext, ReactNode } from 'react';

interface IThemeColors {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  bgLight: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
}

const THEME_COLORS: IThemeColors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  info: '#40a9ff',
  bgLight: '#ffffffff',
  bgCard: '#ffffff',
  textPrimary: '#1f2329',
  textSecondary: '#6b7785',
  textTertiary: '#8c8c8c',
};

const ThemeContext = createContext<IThemeColors>(THEME_COLORS);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 数据驾驶舱的颜色主题
 * @param param0 
 * @returns 
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={THEME_COLORS}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;