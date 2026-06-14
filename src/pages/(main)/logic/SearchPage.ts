import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';
import type { Thread, Tag } from '../../../types/thread.type';
import type { User } from '../../../types/user.type';
import type { Comment } from '../../../types/comment.type';
import type { Category } from '../../../types/category.type';

export interface SearchResults {
  posts: Thread[];
  users: User[];
  tags: Tag[];
  categories: Category[];
  comments: Comment[];
}

export const useSearchPage = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const { data: results = { posts: [], users: [], tags: [], categories: [], comments: [] }, isLoading } = useQuery<SearchResults>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return { posts: [], users: [], tags: [], categories: [], comments: [] };
      }
      const response = await api.get<{ data: SearchResults }>(
        `/search/global?keyword=${encodeURIComponent(debouncedQuery)}`
      );
      return response.data || { posts: [], users: [], tags: [], categories: [], comments: [] };
    },
    enabled: debouncedQuery.length >= 1,
  });

  return {
    query,
    setQuery,
    results,
    isLoading: query !== debouncedQuery || isLoading,
  };
};

