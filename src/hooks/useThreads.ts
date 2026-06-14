import { useState, useCallback } from 'react';
import { threadService } from '../services/threadService';
import type { Thread, CreateThreadInput } from '../types/thread.type';

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threads');
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch thread');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createThread = async (data: CreateThreadInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newThread = await threadService.create(data);
      setThreads((prev) => [newThread, ...prev]);
      return newThread;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create thread');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateThread = async (id: string, data: Partial<CreateThreadInput>) => {
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update thread');
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete thread');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (id: string) => {
    try {
      await threadService.like(id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to like thread');
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
