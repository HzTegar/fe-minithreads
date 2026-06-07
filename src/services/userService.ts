import type { User } from '../types/user.type';

export const userService = {
  getProfile: async (_id: string): Promise<User> => {
    // return api.get(`/users/${id}`);
    throw new Error('Not implemented');
  },

  updateProfile: async (_data: Partial<User>): Promise<User> => {
    // return api.put('/users/profile', data);
    throw new Error('Not implemented');
  },
};
