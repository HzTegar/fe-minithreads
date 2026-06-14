import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { userService } from "../../../services/userService";
import { useAuth } from "../../../hooks/useAuth";
import type { Thread } from "../../../types/thread.type";
import type { User, UserLevel } from "../../../types/user.type";

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

  const {
    data: profile,
    isLoading,
    isError: notFound,
  } = useQuery<PublicProfile | null>({
    queryKey: ["user-profile", username],
    queryFn: async () => {
      if (!username) return null;
      const res = await api.get<{ success: boolean; data: PublicProfile }>(
        `/users/${encodeURIComponent(username)}`,
      );
      return res.data;
    },
    enabled: !!username,
  });

  // Role assignment (admin only, demo switch)
  const [selectedRole, setSelectedRole] = useState<UserLevel>("moderator");
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);
  const [roleMessage, setRoleMessage] = useState("");
  const [roleError, setRoleError] = useState("");

  // Don't show Follow button on own profile
  const isOwnProfile = !!currentUser && currentUser.username === username;

  // Hanya admin yang boleh mengubah role, dan tidak bisa mengubah role miliknya sendiri
  const canAssignRole = currentUser?.level === "admin" && !isOwnProfile;

  // Initialize role selection when profile loads
  useEffect(() => {
    if (profile?.user.level) {
      setSelectedRole(profile.user.level === "admin" ? "moderator" : "admin");
    }
  }, [profile?.user.level]);

  const followMutation = useMutation({
    mutationFn: () => userService.toggleFollow(profile?.user.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", username] });
    },
    onError: (err: unknown) => {
      alert(err instanceof Error ? err.message : "Gagal mengikuti user.");
    },
  });

  const handleAssignRole = async () => {
    if (!profile || isRoleUpdating) return;
    setIsRoleUpdating(true);
    setRoleMessage("");
    setRoleError("");
    try {
      const result = await userService.assignRole(
        profile.user.id,
        selectedRole,
      );
      queryClient.invalidateQueries({ queryKey: ["user-profile", username] });
      setRoleMessage(result.message);
    } catch (err: unknown) {
      setRoleError(err instanceof Error ? err.message : "Gagal mengubah role user.");
    } finally {
      setIsRoleUpdating(false);
    }
  };

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
    canAssignRole,
    selectedRole,
    setSelectedRole,
    isRoleUpdating,
    roleMessage,
    roleError,
    handleAssignRole,
  };
};
