import { useEffect, useState } from 'react';
import { bookmarkService } from '../../../services/bookmarkService';
import type { Thread } from '../../../types/thread.type';

export const useBookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response: any = await bookmarkService.getAll();
        // Backend returns Bookmark model which has a 'post' relationship
        // and it is paginated, so it's in response.data.data
        const bookmarkedThreads = (response.data?.data || response.data || []).map((b: any) => b.post || b);
        setBookmarks(bookmarkedThreads);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    isLoading
  };
};

