import type { User, AuthState } from '../types/user.type';
import { STORAGE_KEYS } from '../utils/constants';

const getInitialUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!data) return null;
  try {
    const user = JSON.parse(data);
    // Legacy support: map 'role' to 'level' if 'level' is missing
    if (user && !user.level && user.role) {
      user.level = user.role;
    }
    return user;
  } catch (e) {
    return null;
  }
};

let state: AuthState = {
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
};

const listeners = new Set<(state: AuthState) => void>();

export const authStore = {
  getState: () => state,
  
  subscribe: (listener: (state: AuthState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  
  setAuth: (user: User, token: string) => {
    state = { user, token, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    listeners.forEach(l => l(state));
  },
  
  updateUser: (user: User) => {
    state = { ...state, user };
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
