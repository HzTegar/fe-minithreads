import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../hooks/useAuth';
import type { Thread } from '../../../types/thread.type';
import type { User } from '../../../types/user.type';

interface PublicProfile {
  user: User & {
    rank_level: string;
    followers_count: number;
    following_count: number;
  };
  is_following: boolean;
  threads: Thread[];
  threads_count: number;
}

export const useUserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError: notFound } = useQuery<PublicProfile | null>({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      if (!username) return null;
      const res = await api.get<{ success: boolean; data: PublicProfile }>(
        `/users/${encodeURIComponent(username)}`
      );
      return res.data;
    },
    enabled: !!username,
  });

  // Don't show Follow button on own profile
  const isOwnProfile = !!currentUser && currentUser.username === username;

  const followMutation = useMutation({
    mutationFn: () => userService.toggleFollow(profile?.user.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
    },
    onError: (err: any) => {
      alert(err.message || 'Gagal mengikuti user.');
    }
  });

  return {
    profile: profile || null,
    isLoading,
    notFound,
    isAuthenticated,
    isOwnProfile,
    isFollowing: profile?.is_following ?? false,
    followersCount: profile?.user.followers_count ?? 0,
    isFollowLoading: followMutation.isPending,
    handleToggleFollow: () => followMutation.mutate(),
  };
};
