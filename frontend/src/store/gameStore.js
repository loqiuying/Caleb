import { create } from 'zustand';

const KEY = 'caleb-games';

function load() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) {
      const obj = JSON.parse(r);
      if (obj && typeof obj === 'object') return obj;
    }
  } catch (e) {}
  return { records: [] };
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

// 评价文案池
export const GAME_COMMENTS = {
  guess: [
    '直觉很准嘛，下次可以挑战更难的。',
    '推理思路清晰，我都被你猜到了。',
    '差一点点就一次命中了，下次更稳。',
    '不急不躁，每一步都靠近答案，挺好的。',
  ],
  idiom: [
    '词汇量真不错，下次出个更难的。',
    '接得又快又准，看来你读过不少书。',
    '差点把我难住，你接得很漂亮。',
    '这一轮玩得过瘾，再来一局？',
  ],
  '2048': [
    '手速和脑力都在线，佩服。',
    '合并得很果断，节奏感不错。',
    '差一点就 2048 了，再来一把。',
    '走位很有章法，这一局漂亮。',
  ],
};

export function pickComment(game) {
  const arr = GAME_COMMENTS[game] || GAME_COMMENTS.guess;
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useGameStore = create((set, get) => ({
  records: load().records || [],

  // 添加一局游戏记录
  // { game: 'guess'|'idiom'|'2048', score: number, detail?: string }
  addRecord: (data) => {
    const rec = {
      id: `g-${Date.now()}`,
      game: data.game,
      score: data.score ?? 0,
      detail: data.detail || '',
      date: Date.now(),
    };
    const next = [rec, ...get().records];
    set({ records: next });
    save({ records: next });
  },

  // 清空记录
  clearRecords: () => {
    set({ records: [] });
    save({ records: [] });
  },

  // 取某游戏的最佳成绩（guess/idiom 取最少次数；2048 取最高分）
  bestOf: (game) => {
    const list = get().records.filter((r) => r.game === game);
    if (!list.length) return null;
    if (game === '2048') {
      return list.reduce((m, r) => (r.score > m.score ? r : m), list[0]);
    }
    return list.reduce((m, r) => (r.score < m.score ? r : m), list[0]);
  },
}));
