const THEME_KEY = 'app_theme';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
}

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark';
};

let state: ThemeState = { theme: getInitialTheme() };

const listeners = new Set<(state: ThemeState) => void>();

const applyThemeClass = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const notify = () => {
  listeners.forEach((fn) => fn(state));
};

applyThemeClass(state.theme);

export const themeStore = {
  getState: () => state,
  subscribe: (listener: (state: ThemeState) => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  setTheme: (theme: Theme) => {
    state = { theme };
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    applyThemeClass(theme);
    notify();
  },
  toggleTheme: () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    themeStore.setTheme(next);
  },
};
