import { useEffect, useState } from 'react';
import { threadService } from '../../../services/threadService';
import { categoryService } from '../../../services/categoryService';
import type { Category } from '../../../types/category.type';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../hooks/useAuth';
import { authStore } from '../../../store/authStore';
import type { Thread } from '../../../types/thread.type';

export const useHomePage = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [threadCount, setThreadCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCatLoading, setIsCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catModalMode, setCatModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [catDeleteTarget, setCatDeleteTarget] = useState<Category | null>(null);
  const [isCatDeleting, setIsCatDeleting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch all threads for the list
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await threadService.getAll();
        setThreads(data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreads();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCatLoading(true);
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal memuat kategori.';
        setCatError(message);
      } finally {
        setIsCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openCreateCatModal = () => {
    setCatModalMode('create');
    setSelectedCat(null);
    setIsCatModalOpen(true);
  };

  const openEditCatModal = (cat: Category) => {
    setCatModalMode('edit');
    setSelectedCat(cat);
    setIsCatModalOpen(true);
  };

  const closeCatModal = () => {
    setIsCatModalOpen(false);
    setSelectedCat(null);
  };

  const handleCatSubmit = async (
    values: { name: string; description: string },
    setSubmitting: (isSubmitting: boolean) => void,
    setFieldError: (field: string, message: string) => void
  ) => {
    try {
      if (catModalMode === 'create') {
        const newCat = await categoryService.create({ name: values.name.trim() });
        setCategories(prev => [...prev, newCat]);
      } else if (selectedCat) {
        const updated = await categoryService.update(selectedCat.id, { name: values.name.trim() });

        setCategories(prev => prev.map(c => c.id === selectedCat.id ? updated : c));
      }
      closeCatModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan kategori.';
      setFieldError('name', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCatDelete = async () => {
    if (!catDeleteTarget) return;
    setIsCatDeleting(true);
    try {
      await categoryService.delete(catDeleteTarget.id);
      setCategories(prev => prev.filter(c => c.id !== catDeleteTarget.id));
      setCatDeleteTarget(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus kategori.';
      setCatError(message);
      setCatDeleteTarget(null);
    } finally {
      setIsCatDeleting(false);
    }
  };

  // Refresh user data from server to get latest reputation_points & thread count
  const userId = user?.id;
  const username = user?.username;

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const refreshUser = async () => {
      try {
        const freshUser = await userService.getProfile();
        authStore.updateUser(freshUser);
      } catch {
        // silently ignore — user data from localStorage is still usable
      }
    };

    const fetchThreadCount = async () => {
      if (!username) return;
      try {
        const userThreads = await threadService.getByUser(username);
        setThreadCount(userThreads.length);
      } catch {
        setThreadCount(0);
      }
    };

    refreshUser();
    fetchThreadCount();
  }, [isAuthenticated, userId, username]);

  // reputation_points is the backend field
  const reputation = user?.reputation_points ?? 0;

  // Rank names & thresholds — identical to backend User.php RANKS constant
  const RANKS = [
    { name: 'Bronze',       min: 0,    next: 20 },
    { name: 'Silver',       min: 20,   next: 100 },
    { name: 'Gold',         min: 100,  next: 500 },
    { name: 'Platinum',     min: 500,  next: 1000 },
    { name: 'Diamond',      min: 1000, next: 1500 },
    { name: 'Master',       min: 1500, next: 2500 },
    { name: 'Grand Master', min: 2500, next: Infinity },
  ];

  // Use rank_level from backend directly (already computed server-side)
  const rankName = user?.rank_level ?? 'Bronze';
  const currentRank = RANKS.find(r => r.name === rankName) ?? RANKS[0];
  const progress =
    currentRank.next === Infinity
      ? 100
      : Math.min(100, ((reputation - currentRank.min) / (currentRank.next - currentRank.min)) * 100);

  return {
    threads,
    isLoading,
    user,
    isAuthenticated,
    reputation,
    currentRank,
    progress,
    threadCount,
    categories,
    isCatLoading,
    catError,
    isCatModalOpen,
    catModalMode,
    selectedCat,
    catDeleteTarget,
    setCatDeleteTarget,
    isCatDeleting,
    openCreateCatModal,
    openEditCatModal,
    closeCatModal,
    handleCatSubmit,
    handleCatDelete,
  };
};