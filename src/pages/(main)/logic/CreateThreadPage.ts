import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { threadService } from '../../../services/threadService';
import { userService } from '../../../services/userService';
import { authStore } from '../../../store/authStore';

export const useCreateThreadPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => threadService.create(data),
    onSuccess: async (response) => {
      // Refresh user profile so reputation_points updates immediately in sidebar
      try {
        const freshUser = await userService.getProfile();
        authStore.updateUser(freshUser);
        queryClient.invalidateQueries({ queryKey: ['user-profile', freshUser.id] });
      } catch {
        // non-critical, ignore
      }

      // Redirect to the newly created thread if ID is available, else to home
      const threadId = response?.id || response?.data?.id;
      if (threadId) {
        navigate(`/thread/${threadId}`);
      } else {
        navigate('/');
      }
    },
  });

  return {
    isLoading: createMutation.isPending,
    error: (createMutation.error as any)?.message || '',
    handleSubmit: (data: any) => createMutation.mutate(data)
  };
};

