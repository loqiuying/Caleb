import { create } from 'zustand';
import { sessionService } from '../services/sessionService.js';

// 会话状态管理
export const useSessionStore = create((set, get) => ({
  // 会话列表
  sessions: [],
  // 当前选中的会话 ID
  currentSessionId: null,
  // 加载状态
  loading: false,
  // 错误信息
  error: null,

  // 加载会话列表
  loadSessions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await sessionService.list(1, 20);
      const list = Array.isArray(res) ? res : res.data || res.sessions || [];
      // 按 updated_at 倒序排序
      const sorted = [...list].sort((a, b) => {
        const ta = new Date(a.updated_at || a.updatedAt || 0).getTime();
        const tb = new Date(b.updated_at || b.updatedAt || 0).getTime();
        return tb - ta;
      });
      set({ sessions: sorted, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('加载会话列表失败:', error);
    }
  },

  // 创建会话
  createSession: async (title) => {
    try {
      const session = await sessionService.create(title);
      set((state) => ({
        sessions: [session, ...state.sessions],
        currentSessionId: session.id,
      }));
      return session;
    } catch (error) {
      console.error('创建会话失败:', error);
      throw error;
    }
  },

  // 选中会话
  selectSession: (id) => {
    set({ currentSessionId: id });
  },

  // 删除会话
  deleteSession: async (id) => {
    try {
      await sessionService.delete(id);
      set((state) => {
        const sessions = state.sessions.filter((s) => s.id !== id);
        const currentSessionId =
          state.currentSessionId === id ? null : state.currentSessionId;
        return { sessions, currentSessionId };
      });
    } catch (error) {
      console.error('删除会话失败:', error);
      throw error;
    }
  },

  // 重命名会话
  renameSession: async (id, title) => {
    try {
      const updated = await sessionService.update(id, title);
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === id ? { ...s, ...updated, title } : s
        ),
      }));
      return updated;
    } catch (error) {
      console.error('重命名会话失败:', error);
      throw error;
    }
  },

  // 获取当前会话
  getCurrentSession: () => {
    const { sessions, currentSessionId } = get();
    return sessions.find((s) => s.id === currentSessionId) || null;
  },

  // 单会话模式：启动时加载会话，无则创建一个，并设为当前
  initSingleSession: async () => {
    set({ loading: true, error: null });
    try {
      const res = await sessionService.list(1, 20);
      const list = Array.isArray(res) ? res : res.data || res.sessions || [];
      const sorted = [...list].sort((a, b) => {
        const ta = new Date(a.updated_at || a.updatedAt || 0).getTime();
        const tb = new Date(b.updated_at || b.updatedAt || 0).getTime();
        return tb - ta;
      });
      if (sorted.length > 0) {
        // 已有会话：选第一个
        set({ sessions: sorted, currentSessionId: sorted[0].id, loading: false });
      } else {
        // 无会话：创建一个
        const session = await sessionService.create('与 Caleb 的对话');
        set({ sessions: [session], currentSessionId: session.id, loading: false });
      }
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('初始化会话失败:', error);
    }
  },
}));
