import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import type { Thread } from '../../../types/thread.type';

export const useSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          // Menggunakan endpoint global search dari backend
          const response = await api.get<{ data: { posts: Thread[] } }>(`/search/global?q=${query}`);
          setResults(response.data.posts || []);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading
  };
};

