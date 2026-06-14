export const API_BASE_URL = "http://127.0.0.1:8000/api";

// Base URL backend tanpa "/api", dipakai untuk akses file di /storage
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const APP_NAME = 'MiniThreads';

/**
 * Ubah path avatar relatif dari backend (mis. "/storage/avatars/xxx.jpg")
 * menjadi full URL ke backend (mis. "http://127.0.0.1:8000/storage/avatars/xxx.jpg").
 * Kalau sudah full URL (http/https), data:, atau blob:, dibiarkan apa adanya.
 */
export const resolveAvatarUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${BACKEND_BASE_URL}${path}`;
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

export const CATEGORIES = [
  { id: '019ea0a3-5c93-711c-b503-700faedd9f1c', name: 'Teknologi' },
  { id: '019ea0a3-5c9a-723a-98d0-eca226979415', name: 'Programming' },
  { id: '019ea0a3-5ca0-70f6-ae68-3a0f13987940', name: 'Kesehatan' },
  { id: '019ea0a3-5ca6-70d0-a57f-a74ab5681f4d', name: 'Gaya Hidup' },
  { id: '019ea0a3-5cae-70d6-b8b2-79c326480e1e', name: 'Pendidikan' },
  { id: '019ea0a3-5cb5-72ce-bfd1-d2b7e0909d18', name: 'Hiburan' },
];
