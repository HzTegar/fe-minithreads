import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../hooks/useAuth';
import type { Thread } from '../../../types/thread.type';
import type { User, UserLevel } from '../../../types/user.type';

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

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Role assignment (admin only, demo switch)
  const [selectedRole, setSelectedRole] = useState<UserLevel>('moderator');
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);
  const [roleMessage, setRoleMessage] = useState('');
  const [roleError, setRoleError] = useState('');

  // Don't show Follow button on own profile
  const isOwnProfile = !!currentUser && currentUser.username === username;

  // Hanya admin yang boleh mengubah role, dan tidak bisa mengubah role miliknya sendiri
  const canAssignRole = currentUser?.level === 'admin' && !isOwnProfile;

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res = await api.get<{ success: boolean; data: PublicProfile }>(
          `/users/${encodeURIComponent(username)}`
        );
        setProfile(res.data);
        setIsFollowing(res.data.is_following);
        setFollowersCount(res.data.user.followers_count ?? 0);
        // Default pilihan switch role: kebalikan dari role saat ini (admin <-> moderator)
        setSelectedRole(res.data.user.level === 'admin' ? 'moderator' : 'admin');
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleToggleFollow = async () => {
    if (!profile || isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      const result = await userService.toggleFollow(profile.user.id);
      setIsFollowing(result.is_following);
      setFollowersCount(prev => result.is_following ? prev + 1 : prev - 1);
    } catch (err: any) {
      alert(err.message || 'Gagal mengikuti user.');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!profile || isRoleUpdating) return;
    setIsRoleUpdating(true);
    setRoleMessage('');
    setRoleError('');
    try {
      const result = await userService.assignRole(profile.user.id, selectedRole);
      setProfile(prev =>
        prev ? { ...prev, user: { ...prev.user, level: result.level } } : prev
      );
      setRoleMessage(result.message);
    } catch (err: any) {
      setRoleError(err.message || 'Gagal mengubah role user.');
    } finally {
      setIsRoleUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    notFound,
    isAuthenticated,
    isOwnProfile,
    isFollowing,
    followersCount,
    isFollowLoading,
    handleToggleFollow,
    canAssignRole,
    selectedRole,
    setSelectedRole,
    isRoleUpdating,
    roleMessage,
    roleError,
    handleAssignRole,
  };
};
