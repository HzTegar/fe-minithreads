import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
=======
import { useFormik } from 'formik';
>>>>>>> origin/najwa-dev
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { threadService } from '../../../services/threadService';
import { authStore } from '../../../store/authStore';
<<<<<<< HEAD
import type { UserLevel } from '../../../types/user.type';
=======
import type { UserLevel, ProfileFormValues } from '../../../types/user.type';
import { profileInitialValues, profileValidationSchema } from '../../../types/user.type';
import type { Thread } from '../../../types/thread.type';
>>>>>>> origin/najwa-dev

export const useProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
=======

  const [myThreads, setMyThreads] = useState<Thread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refreshData = async () => {
      try {
        const freshUser = await userService.getProfile();
        authStore.updateUser(freshUser);
      } catch {
        // silently ignore, use cached data
      }
    };
>>>>>>> origin/najwa-dev

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

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/najwa-dev
    },
  });

  const openEdit = () => {
    formik.resetForm({
      values: {
<<<<<<< HEAD
        bio: authUser?.bio ?? '',
        avatar: null,
      }
    });
    setAvatarPreview(null);
=======
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
>>>>>>> origin/najwa-dev
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setAvatarPreview(null);
<<<<<<< HEAD
=======
    setAvatarFile(null);
    setAvatarError('');
    setSaveError('');
    setSaveSuccess('');
>>>>>>> origin/najwa-dev
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
<<<<<<< HEAD

    formik.setFieldValue('avatar', file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Demo role switcher
=======
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

>>>>>>> origin/najwa-dev
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
<<<<<<< HEAD
=======
    formik,
>>>>>>> origin/najwa-dev
    isEditOpen,
    avatarPreview,
    avatarError,
    fileInputRef,
<<<<<<< HEAD
    openEdit,
    closeEdit,
    handleAvatarChange,
    formik,
=======
    saveError,
    saveSuccess,
    openEdit,
    closeEdit,
    handleAvatarChange,
>>>>>>> origin/najwa-dev
    handleLevelChange,
    handleLogout,
  };
};