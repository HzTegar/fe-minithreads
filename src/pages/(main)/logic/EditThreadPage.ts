import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { threadService } from '../../../services/threadService';

export const useEditThreadPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: thread, isLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => threadService.getById(id || ''),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => threadService.update(id || '', data),
    onSuccess: () => {
      navigate(`/thread/${id}`);
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to update thread');
    }
  });

  const initialData = thread ? {
    title: thread.title,
    body: thread.body,
    category_id: thread.category_id,
    tags: thread.tags?.map(t => t.name) || [],
  } : undefined;

  return {
    initialData,
    isLoading,
    handleSubmit: (data: any) => mutation.mutate(data),
    isSubmitting: mutation.isPending,
  };
};

