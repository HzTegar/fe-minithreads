import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const getHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Jika server mengembalikan 401, token sudah expired atau tidak valid.
 * Hapus auth state dan redirect ke login.
 */
const handleUnauthorized = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  // Redirect hanya jika belum di halaman login/register
  if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
    window.location.href = '/login';
  }
};

const parseError = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthenticated. Please log in again.');
    }
    if (!response.ok) {
      const msg = await parseError(response);
      throw new Error(msg);
    }
    return response.json();
  },

  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthenticated. Please log in again.');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', { status: response.status, data: errorData });
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    return response.json();
  },

  put: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthenticated. Please log in again.');
    }
    if (!response.ok) {
      const msg = await parseError(response);
      throw new Error(msg);
    }
    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthenticated. Please log in again.');
    }
    if (!response.ok) {
      const msg = await parseError(response);
      throw new Error(msg);
    }
    return response.json();
  },
};
