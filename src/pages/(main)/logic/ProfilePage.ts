import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import type { UserLevel } from '../../../types/user.type';

export const useProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();

  // Fallback to mock if not logged in
  const displayUser = authUser || {
    id: 'mock-1',
    username: 'admin',
    email: 'admin@example.com',
    bio: 'Software engineer and creator of MiniThreads.',
    level: 'admin' as UserLevel,
    reputation: 1250,
    points: 450,
    createdAt: '2023-01-01T00:00:00Z',
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (authUser) {
      updateUser({ ...authUser, level: e.target.value as UserLevel });
    }
  };

  return {
    authUser,
    displayUser,
    handleLevelChange
  };
};

