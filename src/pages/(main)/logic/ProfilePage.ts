import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { threadService } from '../../../services/threadService';
import { authStore } from '../../../store/authStore';
import type { UserLevel, ProfileFormValues } from '../../../types/user.type';
import { profileInitialValues, profileValidationSchema } from '../../../types/user.type';

export const useProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

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

  const formik = useFormik<ProfileFormValues>({
    initialValues: profileInitialValues,
    validationSchema: profileValidationSchema,
    enableReinitialize: false,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSaveError('');
      setSaveSuccess('');
      try {
        const formData = new FormData();

        if (values.username.trim() && values.username.trim() !== authUser?.username) {
          formData.append('username', values.username.trim());
        }

        formData.append('bio', values.bio ?? '');

        if (values.password) {
          formData.append('password', values.password);
        }

        if (avatarFile) {
          formData.append('avatar', avatarFile);
        }

        const updatedUser = await userService.updateProfile(formData);
        authStore.updateUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ['profile'] });

        setSaveSuccess('Profil berhasil diperbarui!');
        setAvatarFile(null);
        setAvatarPreview(null);

        resetForm({
          values: {
            username: updatedUser.username,
            bio: updatedUser.bio ?? '',
            password: '',
            confirmPassword: '',
          },
        });

        setTimeout(() => {
          setIsEditOpen(false);
          setSaveSuccess('');
        }, 1000);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal menyimpan profil.';

        if (/username/i.test(message)) {
          setErrors({ username: message });
        } else if (/password/i.test(message)) {
          setErrors({ password: message });
        } else {
          setSaveError(message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openEdit = () => {
    formik.resetForm({
      values: {
        username: authUser?.username ?? '',
        bio: authUser?.bio ?? '',
        password: '',
        confirmPassword: '',
      },
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError('');
    setSaveError('');
    setSaveSuccess('');
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarError('');
    setSaveError('');
    setSaveSuccess('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setAvatarError('Hanya file JPEG/PNG yang diizinkan.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Ukuran gambar maksimal 2MB.');
      return;
    }
    setAvatarError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
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
    formik,
    isEditOpen,
    avatarPreview,
    avatarError,
    fileInputRef,
    saveError,
    saveSuccess,
    openEdit,
    closeEdit,
    handleAvatarChange,
    handleLogout,
  };
};