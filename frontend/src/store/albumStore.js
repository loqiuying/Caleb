import { create } from 'zustand';

const ALBUM_KEY = 'caleb-album';
const CAT_KEY = 'caleb-album-categories';

const DEFAULT_CATEGORIES = ['全部', '日常', '风景', '美食', '宠物', '其他'];

// 预设示例
const SAMPLE = [
  { id: 'p1', src: '', category: '日常', note: '今天的午饭', date: Date.now() - 86400000 },
  { id: 'p2', src: '', category: '风景', note: '路边的银杏树', date: Date.now() - 2 * 86400000 },
];

function loadPhotos() {
  try { const r = localStorage.getItem(ALBUM_KEY); if (r) return JSON.parse(r); } catch(e){}
  return [];
}

function loadCategories() {
  try {
    const r = localStorage.getItem(CAT_KEY);
    if (r) {
      const arr = JSON.parse(r);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch(e){}
  return DEFAULT_CATEGORIES;
}

export const useAlbumStore = create((set, get) => ({
  photos: loadPhotos(),
  categories: loadCategories(),

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

  // 新增分类（去重，"全部"为系统分类不可添加）
  addCategory: (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    const cats = get().categories;
    if (cats.includes(trimmed)) return;
    const next = [...cats, trimmed];
    set({ categories: next });
    localStorage.setItem(CAT_KEY, JSON.stringify(next));
  },

  // 删除分类（"全部"不可删除）
  deleteCategory: (name) => {
    if (name === '全部') return;
    const next = get().categories.filter((c) => c !== name);
    set({ categories: next });
    localStorage.setItem(CAT_KEY, JSON.stringify(next));
  },
}));
