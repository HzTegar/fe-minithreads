import { useState, useEffect } from 'react';
import { authStore } from '../store/authStore';

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authStore.setAuth,
    logout: authStore.clearAuth,
  };
};
