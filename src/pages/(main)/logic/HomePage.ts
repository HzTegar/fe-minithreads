import { useEffect, useState } from 'react';
import { threadService } from '../../../services/threadService';
import { useAuth } from '../../../hooks/useAuth';
import type { Thread } from '../../../types/thread.type';

export const useHomePage = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await threadService.getAll();
        setThreads(data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const reputation = user?.reputation_points || 0;
  
  // Rank logic (synchronized with backend User.php)
  const RANKS = [
    { name: 'Iron',      min: 0,     next: 50 },
    { name: 'Bronze',    min: 50,    next: 200 },
    { name: 'Silver',    min: 200,   next: 500 },
    { name: 'Gold',      min: 500,   next: 1000 },
    { name: 'Platinum',  min: 1000,  next: 2500 },
    { name: 'Diamond',   min: 2500,  next: 5000 },
    { name: 'Ascendant', min: 5000,  next: 10000 },
    { name: 'Immortal',  min: 10000, next: 25000 },
    { name: 'Radiant',   min: 25000, next: Infinity },
  ];

  const currentRank = [...RANKS].reverse().find(r => reputation >= r.min) || RANKS[0];
  const progress = currentRank.next === Infinity 
    ? 100 
    : ((reputation - currentRank.min) / (currentRank.next - currentRank.min)) * 100;

  return {
    threads,
    isLoading,
    user,
    isAuthenticated,
    reputation,
    currentRank,
    progress
  };
};

