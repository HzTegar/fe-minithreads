import { useQuery } from '@tanstack/react-query';
import { threadService } from '../../../services/threadService';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../hooks/useAuth';
import { authStore } from '../../../store/authStore';

export const useHomePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Fetch all threads with React Query
  const { data: threads = [], isLoading: isLoadingThreads } = useQuery({
    queryKey: ['threads'],
    queryFn: () => threadService.getAll(),
  });

  // Refresh user data from server with React Query
  useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      const freshUser = await userService.getProfile();
      authStore.updateUser(freshUser);
      return freshUser;
    },
    enabled: !!isAuthenticated && !!user?.id,
  });

  // Fetch user thread count with React Query
  const { data: userThreads = [] } = useQuery({
    queryKey: ['user-threads', user?.username],
    queryFn: () => threadService.getByUser(user?.username || ''),
    enabled: !!isAuthenticated && !!user?.username,
  });

  const threadCount = userThreads.length;
  const reputation = user?.reputation_points ?? 0;

  // Rank names & thresholds — identical to backend User.php RANKS constant
  const RANKS = [
    { name: 'Bronze',       min: 0,    next: 20 },
    { name: 'Silver',       min: 20,   next: 100 },
    { name: 'Gold',         min: 100,  next: 500 },
    { name: 'Platinum',     min: 500,  next: 1000 },
    { name: 'Diamond',      min: 1000, next: 1500 },
    { name: 'Master',       min: 1500, next: 2500 },
    { name: 'Grand Master', min: 2500, next: Infinity },
  ];

  // Use rank_level from backend directly (already computed server-side)
  const rankName = user?.rank_level ?? 'Bronze';
  const currentRank = RANKS.find(r => r.name === rankName) ?? RANKS[0];
  const progress =
    currentRank.next === Infinity
      ? 100
      : Math.min(100, ((reputation - currentRank.min) / (currentRank.next - currentRank.min)) * 100);

  return {
    threads,
    isLoading: isLoadingThreads,
    user,
    isAuthenticated,
    reputation,
    currentRank,
    progress,
    threadCount,
  };
};
