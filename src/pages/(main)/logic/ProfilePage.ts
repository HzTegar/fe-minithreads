import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { threadService } from '../../../services/threadService';
import { authStore } from '../../../store/authStore';
import type { UserLevel } from '../../../types/user.type';

export const useProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 1. Fetch fresh profile query
  useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const freshUser = await userService.getProfile();
      authStore.updateUser(freshUser);
      return freshUser;
    },
    enabled: !!authUser?.id,
  });

  // 2. Fetch my threads query
  const { data: myThreads = [], isLoading: isLoadingThreads } = useQuery({
    queryKey: ['my-threads', authUser?.username],
    queryFn: () => threadService.getByUser(authUser?.username || ''),
    enabled: !!authUser?.username,
  });

  // 3. Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: { bio: string; avatar: File | null }) => {
      const formData = new FormData();
      formData.append('bio', values.bio);
      if (values.avatar) {
        formData.append('avatar', values.avatar);
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
      return data.user;
    },
    onSuccess: (updatedUser) => {
      authStore.updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      closeEdit();
    },
  });

  // 4. Formik for Bio & Avatar validation
  const formik = useFormik({
    initialValues: {
      bio: authUser?.bio ?? '',
      avatar: null as File | null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      bio: Yup.string().max(500, 'Bio tidak boleh lebih dari 500 karakter'),
      avatar: Yup.mixed()
        .nullable()
        .test('fileType', 'Hanya file JPEG/PNG yang diizinkan.', (value) => {
          if (!value) return true;
          const file = value as File;
          return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
        })
        .test('fileSize', 'Ukuran gambar maksimal 2MB.', (value) => {
          if (!value) return true;
          const file = value as File;
          return file.size <= 2 * 1024 * 1024;
        }),
    }),
    onSubmit: async (values) => {
      await updateProfileMutation.mutateAsync(values);
    },
  });

  const openEdit = () => {
    formik.resetForm({
      values: {
        bio: authUser?.bio ?? '',
        avatar: null,
      }
    });
    setAvatarPreview(null);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    formik.setFieldValue('avatar', file);
    setAvatarPreview(URL.createObjectURL(file));
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
    isEditOpen,
    avatarPreview,
    fileInputRef,
    openEdit,
    closeEdit,
    handleAvatarChange,
    formik,
    handleLevelChange,
    handleLogout,
  };
};
