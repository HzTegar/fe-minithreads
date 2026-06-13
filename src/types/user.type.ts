import * as Yup from "yup";

export type UserLevel = "user" | "moderator" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  level: UserLevel;
  avatarUrl?: string;
  avatar_url?: string;
  bio?: string;
  reputation?: number;
  points?: number;
  reputation_points?: number;
  rank_level?: string;
  followers_count?: number;
  following_count?: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
export interface ProfileFormValues {
  username: string;
  bio: string;
  password: string;
  confirmPassword: string;
}

export const profileInitialValues: ProfileFormValues = {
  username: '',
  bio: '',
  password: '',
  confirmPassword: '',
};

export const profileValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required('Username wajib diisi')
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),

  bio: Yup.string()
    .max(500, 'Bio maksimal 500 karakter'),

  password: Yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .min(8, 'Password minimal 8 karakter')
    .notRequired(),

  confirmPassword: Yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .oneOf([Yup.ref('password'), undefined], 'Konfirmasi password tidak cocok')
    .when('password', {
      is: (val: string) => !!val && val.length > 0,
      then: (schema) => schema.required('Konfirmasi password wajib diisi'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

