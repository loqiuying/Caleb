import { create } from 'zustand';

const ALBUM_KEY = 'caleb-album';

// 预设示例
const SAMPLE = [
  { id: 'p1', src: '', category: '日常', note: '今天的午饭', date: Date.now() - 86400000 },
  { id: 'p2', src: '', category: '风景', note: '路边的银杏树', date: Date.now() - 2 * 86400000 },
];

function load() {
  try { const r = localStorage.getItem(ALBUM_KEY); if (r) return JSON.parse(r); } catch(e){}
  return [];
}

export const useAlbumStore = create((set, get) => ({
  photos: load(),
  categories: ['全部', '日常', '风景', '美食', '宠物', '其他'],

  addPhoto: (data) => {
    const photo = {
      id: `p-${Date.now()}`,
      src: data.src, // base64
      category: data.category || '其他',
      note: data.note || '',
      date: Date.now(),
    };
    const next = [photo, ...get().photos];
    set({ photos: next });
    localStorage.setItem(ALBUM_KEY, JSON.stringify(next));
  },

  deletePhoto: (id) => {
    const next = get().photos.filter((p) => p.id !== id);
    set({ photos: next });
    localStorage.setItem(ALBUM_KEY, JSON.stringify(next));
  },

  updatePhoto: (id, patch) => {
    const next = get().photos.map((p) => p.id === id ? { ...p, ...patch } : p);
    set({ photos: next });
    localStorage.setItem(ALBUM_KEY, JSON.stringify(next));
  },
}));
