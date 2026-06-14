import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { threadService } from '../../../services/threadService';
import { userService } from '../../../services/userService';
import { authStore } from '../../../store/authStore';
import type { CreateThreadInput, Thread } from '../../../types/thread.type';

export const useCreateThreadPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateThreadInput) => threadService.create(data),
    onSuccess: async (response: Thread) => {
      try {
        const freshUser = await userService.getProfile();
        authStore.updateUser(freshUser);
        queryClient.invalidateQueries({ queryKey: ['user-profile', freshUser.id] });
      } catch {
        // non-critical, ignore
      }

      const threadId = response?.id;
      if (threadId) {
        navigate(`/thread/${threadId}`);
      } else {
        navigate('/');
      }
    },
  });

  return {
    isLoading: createMutation.isPending,
    error: createMutation.error instanceof Error ? createMutation.error.message : '',
    handleSubmit: (data: CreateThreadInput) => createMutation.mutate(data)
  };
};

