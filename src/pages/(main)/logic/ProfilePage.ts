import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { threadService } from '../../../services/threadService';
import { authStore } from '../../../store/authStore';
import type { UserLevel } from '../../../types/user.type';
import type { Thread } from '../../../types/thread.type';


export const useProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const [myThreads, setMyThreads] = useState<Thread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  // Edit profile state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch fresh profile + threads on mount
  useEffect(() => {
    const refreshData = async () => {
      try {
        const freshUser = await userService.getProfile();
        authStore.updateUser(freshUser);
      } catch {
        // silently ignore, use cached data
      }
    };

    const fetchMyThreads = async () => {
      if (!authUser?.username) return;
      try {
        const threads = await threadService.getByUser(authUser.username);
        setMyThreads(threads);
      } catch {
        setMyThreads([]);
      } finally {
        setIsLoadingThreads(false);
      }
    };

    refreshData();
    fetchMyThreads();
  }, [authUser?.id]);

  // Sync bio input when edit opens
  const openEdit = () => {
    setBioInput(authUser?.bio ?? '');
    setAvatarFile(null);
    setAvatarPreview(null);
    setSaveError('');
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setSaveError('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Basic client-side validation
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setSaveError('Hanya file JPEG/PNG yang diizinkan.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Ukuran gambar maksimal 2MB.');
      return;
    }
    setSaveError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      // Backend ProfileController uses multipart/form-data for avatar upload
      const formData = new FormData();
      formData.append('bio', bioInput);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/profile/update`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal menyimpan profil.');
      }

      const data = await response.json();
      authStore.updateUser(data.user);
      closeEdit();
    } catch (err: any) {
      setSaveError(err.message || 'Gagal menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  // Demo role switcher
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (authUser) {
      authStore.updateUser({ ...authUser, level: e.target.value as UserLevel });
    }
  };

  const handleLogout = () => {
    authStore.clearAuth();
    navigate('/login');
  };

  const reputation = authUser?.reputation_points ?? 0;
  const rankName = authUser?.rank_level ?? 'Bronze';

  return {
    authUser,
    reputation,
    rankName,
    myThreads,
    isLoadingThreads,
    // edit modal
    isEditOpen,
    bioInput,
    setBioInput,
    avatarPreview,
    fileInputRef,
    isSaving,
    saveError,
    openEdit,
    closeEdit,
    handleAvatarChange,
    handleSaveProfile,
    // misc
    handleLevelChange,
    handleLogout,
  };
};
