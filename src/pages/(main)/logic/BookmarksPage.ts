import { useQuery } from '@tanstack/react-query';
import { bookmarkService } from '../../../services/bookmarkService';

export const useBookmarksPage = () => {
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await bookmarkService.getAll();
      return response;
    }
  });

  return {
    bookmarks,
    isLoading
  };
};

