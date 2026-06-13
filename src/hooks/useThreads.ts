import { useState, useCallback } from 'react';
import { threadService } from '../services/threadService';
import type { Thread } from '../types/thread.type';

export const useThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await threadService.getAll();
      setThreads(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch threads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchThreadById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await threadService.getById(id);
      setCurrentThread(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch thread');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createThread = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newThread = await threadService.create(data);
      setThreads((prev) => [newThread, ...prev]);
      return newThread;
    } catch (err: any) {
      setError(err.message || 'Failed to create thread');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateThread = async (id: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedThread = await threadService.update(id, data);
      setThreads((prev) =>
        prev.map((thread) => (thread.id === id ? updatedThread : thread))
      );
      if (currentThread?.id === id) {
        setCurrentThread(updatedThread);
      }
      return updatedThread;
    } catch (err: any) {
      setError(err.message || 'Failed to update thread');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteThread = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await threadService.delete(id);
      setThreads((prev) => prev.filter((thread) => thread.id !== id));
      if (currentThread?.id === id) {
        setCurrentThread(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete thread');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (id: string) => {
    try {
      await threadService.like(id);
      // Optimistic update or refetch could be done here
      // For now, let's just assume the UI will handle the toggle state locally 
      // or the parent will refetch.
    } catch (err: any) {
      setError(err.message || 'Failed to like thread');
    }
  };

  return {
    threads,
    currentThread,
    isLoading,
    error,
    fetchThreads,
    fetchThreadById,
    createThread,
    updateThread,
    deleteThread,
    toggleLike,
  };
};
