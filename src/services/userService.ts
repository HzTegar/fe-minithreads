import { api } from './api';
import type { User, UserLevel } from '../types/user.type';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.user;
  },

  /**
   * Update profil sendiri.
   * Backend ProfileController membutuhkan multipart/form-data agar avatar bisa diupload,
   * jadi kita pakai fetch langsung (api.post hanya support JSON).
   */
  updateProfile: async (formData: FormData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      window.location.href = '/login';
      throw new Error('Unauthenticated. Please log in again.');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.errors) {
        const firstError = Object.values(data.errors)[0];
        const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
        throw new Error(message || 'Gagal menyimpan profil.');
      }
      throw new Error(data.message || 'Gagal menyimpan profil.');
    }

    return data.user as User;
  },

  toggleFollow: async (userId: string): Promise<{ is_following: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string; is_following?: boolean }>(
      `/user/follow/${userId}`,
      {}
    );
    const is_following = response.message?.includes('mengikuti') && !response.message?.includes('berhenti');
    return { is_following, message: response.message ?? '' };
  },

  /**
   * ADMIN ONLY: Ubah role/level user lain.
   * PUT /api/admin/users/{id}/assign-role
   * Backend hanya menerima: 'user' | 'moderator' | 'admin'
   */
  assignRole: async (
    userId: string,
    level: UserLevel
  ): Promise<{ message: string; id: string; username: string; level: UserLevel }> => {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: { id: string; username: string; level: UserLevel };
    }>(`/admin/users/${userId}/assign-role`, { level });
    return { message: response.message, ...response.data };
  },
};