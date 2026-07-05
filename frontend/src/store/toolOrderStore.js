import { create } from 'zustand';

/**
 * 工具箱入口顺序 store：localStorage 持久化
 *
 * 存储内容：工具 id 数组，如 ['beautify','memory','weather',...]
 * 首次使用时为 null，由组件用默认顺序初始化。
 */

const STORAGE_KEY = 'caleb-tool-order';

function loadOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null; // null 表示用默认顺序
}

export const useToolOrderStore = create((set, get) => ({
  order: loadOrder(),

  // 设置新顺序（拖拽完成时调用）
  setOrder: (newOrder) => {
    set({ order: newOrder });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
  },

  // 重置为默认顺序
  resetOrder: () => {
    set({ order: null });
    localStorage.removeItem(STORAGE_KEY);
  },
}));
