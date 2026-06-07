import type { User } from '../types/user.type';

export const authService = {
  login: async (credentials: any) => {
    // return api.post('/auth/login', credentials);
    console.log('authService.login', credentials);
    return { user: { id: '1', username: 'testuser' }, token: 'fake-jwt-token' };
  },

  register: async (userData: any) => {
    // return api.post('/auth/register', userData);
    console.log('authService.register', userData);
    return { user: { id: '1', username: 'testuser' }, token: 'fake-jwt-token' };
  },

  logout: async () => {
    console.log('authService.logout');
  },

  getCurrentUser: async (): Promise<User> => {
    // return api.get('/auth/me');
    return { id: '1', username: 'testuser', email: 'test@example.com', role: 'user', createdAt: new Date().toISOString() };
  },
};
