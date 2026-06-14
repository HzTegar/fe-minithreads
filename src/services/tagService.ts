import { api } from './api';

const randomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const s = 0.65;
  const l = 0.45;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const hex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  posts_count?: number;
}

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    const response: any = await api.get('/tags');
    return response.data?.data || response.data || response;
  },

  create: async (name: string): Promise<Tag> => {
    const response: any = await api.post('/tags', { name, color: randomColor() });
    return response.data?.data || response.data || response;
  },
};