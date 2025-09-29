import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'ayur-classic' | 'ayur-forest' | 'ayur-sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Array<{
    value: Theme;
    label: string;
    description: string;
  }>;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = [
  {
    value: 'light' as Theme,
    label: 'Light',
    description: 'Clean and bright Ayurvedic theme'
  },
  {
    value: 'dark' as Theme,
    label: 'Dark',
    description: 'Soothing dark mode for evening use'
  },
  {
    value: 'ayur-classic' as Theme,
    label: 'Ayur Classic',
    description: 'Traditional golden Ayurvedic colors'
  },
  {
    value: 'ayur-forest' as Theme,
    label: 'Ayur Forest',
    description: 'Inspired by healing forest herbs'
  },
  {
    value: 'ayur-sunset' as Theme,
    label: 'Ayur Sunset',
    description: 'Warm evening meditation colors'
  }
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('ayuragent-theme') as Theme;
    if (savedTheme && themes.find(t => t.value === savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'ayur-classic', 'ayur-forest', 'ayur-sunset');
    
    // Add current theme class
    if (theme !== 'light') {
      root.classList.add(theme);
    }
    
    localStorage.setItem('ayuragent-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};