import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../../services/notificationService';

export const useNotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data = { notifications: [], unread_count: 0 }, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
  });

  const notifications = data.notifications || [];
  const unreadCount = data.unread_count ?? 0;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    handleMarkAsRead: (id: string) => markAsReadMutation.mutate(id),
    handleMarkAllAsRead: () => markAllAsReadMutation.mutate(),
    handleDelete: (id: string) => deleteMutation.mutate(id),
  };
};
