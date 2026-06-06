import { api } from './api';
import { User } from '../types/user.type';

export const userService = {
  getProfile: async (id: string): Promise<User> => {
    // return api.get(`/users/${id}`);
    throw new Error('Not implemented');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    // return api.put('/users/profile', data);
    throw new Error('Not implemented');
  },
};
