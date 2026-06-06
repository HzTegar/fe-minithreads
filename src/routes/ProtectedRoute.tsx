import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginPage } from '../pages/LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Simple protected route wrapper.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};
