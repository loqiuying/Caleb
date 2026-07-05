import { create } from 'zustand';

const CAL_KEY = 'caleb-calendar';

// 记录类型：与图标/颜色对应
export const RECORD_TYPES = {
  interact: { id: 'interact', label: '一起互动', icon: '💞' },
  study:    { id: 'study',    label: '学习打卡', icon: '📚' },
  game:     { id: 'game',     label: '小游戏',   icon: '🎮' },
  photo:    { id: 'photo',    label: '照片',     icon: '📷' },
  other:    { id: 'other',    label: '其他',     icon: '✏️' },
};

// 预设示例：基于今天生成几条
function makeSamples() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const at = (day, h, mi) => new Date(y, m, day, h, mi).getTime();
  return [
    { id: 'r1', date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, timestamp: at(Math.max(1, d - 2), 20, 15), type: 'interact', title: '一起聊天', description: '聊到了最近的旅行计划，约定下个月去武康路。', aiComment: '看起来你们对这次旅行都很期待呢。' },
    { id: 'r2', date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, timestamp: at(Math.max(1, d - 1), 9, 30),  type: 'study',    title: '法语打卡',  description: '今天背了 30 个法语单词，复习了动词变位。', aiComment: '坚持就是胜利，加油！' },
    { id: 'r3', date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, timestamp: at(d, 14, 0),               type: 'game',     title: '五子棋',  description: '和 Caleb 下了一盘五子棋，险胜。', aiComment: '反应真快，下次再来一局。' },
  ];
}

function load() {
  try {
    const r = localStorage.getItem(CAL_KEY);
    if (r) {
      const arr = JSON.parse(r);
      if (Array.isArray(arr)) return arr;
    }
  } catch(e){}
  const samples = makeSamples();
  try { localStorage.setItem(CAL_KEY, JSON.stringify(samples)); } catch(e){}
  return samples;
}

export const useCalendarStore = create((set, get) => ({
  records: load(),

  addRecord: (data) => {
    const rec = {
      id: `r-${Date.now()}`,
      date: data.date,
      timestamp: data.timestamp || Date.now(),
      type: data.type || 'other',
      title: data.title || '',
      description: data.description || '',
      aiComment: data.aiComment || '',
    };
    const next = [rec, ...get().records];
    set({ records: next });
    localStorage.setItem(CAL_KEY, JSON.stringify(next));
  },

  deleteRecord: (id) => {
    const next = get().records.filter((r) => r.id !== id);
    set({ records: next });
    localStorage.setItem(CAL_KEY, JSON.stringify(next));
  },

  updateRecord: (id, patch) => {
    const next = get().records.map((r) => r.id === id ? { ...r, ...patch } : r);
    set({ records: next });
    localStorage.setItem(CAL_KEY, JSON.stringify(next));
  },
}));
