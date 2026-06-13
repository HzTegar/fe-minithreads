import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { threadService } from '../../../services/threadService';
import { authStore } from '../../../store/authStore';
import type { UserLevel, ProfileFormValues } from '../../../types/user.type';
import { profileInitialValues, profileValidationSchema } from '../../../types/user.type';
import type { Thread } from '../../../types/thread.type';

export const useProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

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
    handleLevelChange,
    handleLogout,
  };
};