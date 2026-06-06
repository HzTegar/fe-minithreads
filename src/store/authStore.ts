import { User, AuthState } from '../types/user.type';
import { STORAGE_KEYS } from '../utils/constants';

let state: AuthState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null'),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
};

const listeners = new Set<(state: AuthState) => void>();

export const authStore = {
  getState: () => state,
  
  subscribe: (listener: (state: AuthState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  setAuth: (user: User, token: string) => {
    state = { user, token, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    listeners.forEach(l => l(state));
  },
  
  clearAuth: () => {
    state = { user: null, token: null, isAuthenticated: false };
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    listeners.forEach(l => l(state));
  },
};
