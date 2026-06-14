import { useState, useEffect } from 'react';
import { themeStore } from '../store/themeStore';

export const useTheme = () => {
  const [state, setState] = useState(themeStore.getState());

  useEffect(() => {
    return themeStore.subscribe(setState);
  }, []);

  return {
    theme: state.theme,
    isDark: state.theme === 'dark',
    isLight: state.theme === 'light',
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
  };
};
