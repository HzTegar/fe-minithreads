import React, { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ThreadDetailPage } from '../pages/ThreadDetailPage';
import { CreateThreadPage } from '../pages/CreateThreadPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SearchPage } from '../pages/SearchPage';

/**
 * Simple routing skeleton using conditional rendering.
 * This is a placeholder until react-router-dom is added.
 */
export const AppRoutes: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple router logic
  if (path === '/login') return <LoginPage />;
  if (path === '/register') return <RegisterPage />;
  if (path === '/create-thread') return <CreateThreadPage />;
  if (path === '/profile') return <ProfilePage />;
  if (path === '/search') return <SearchPage />;
  if (path.startsWith('/thread/')) return <ThreadDetailPage />;
  
  return <HomePage />;
};
