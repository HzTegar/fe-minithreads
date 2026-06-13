import { useQuery } from '@tanstack/react-query';
import { bookmarkService } from '../../../services/bookmarkService';

export const useBookmarksPage = () => {
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response: any = await bookmarkService.getAll();
      // Backend returns Bookmark model which has a 'post' relationship
      // and it is paginated, so it's in response.data.data
      return (response.data?.data || response.data || []).map((b: any) => b.post || b);
    }
  });

  return {
    bookmarks,
    isLoading
  };
};

