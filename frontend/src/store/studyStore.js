import { create } from 'zustand';

const WORDS_KEY = 'caleb-study-words';
const CHECKIN_KEY = 'caleb-study-checkin';

// 预设 10 个英语单词卡
const DEFAULT_WORDS = [
  { id: 'w1', word: 'serendipity',  pos: 'n.', meaning: '意外发现美好事物的能力', example: 'Finding this café was pure serendipity.' },
  { id: 'w2', word: 'resilient',    pos: 'adj.', meaning: '有韧性的，能快速恢复的', example: 'She is resilient enough to handle setbacks.' },
  { id: 'w3', word: 'eloquent',     pos: 'adj.', meaning: '雄辩的，有口才的', example: 'He gave an eloquent speech at the wedding.' },
  { id: 'w4', word: 'ephemeral',    pos: 'adj.', meaning: '短暂的，转瞬即逝的', example: 'Cherry blossoms are beautiful but ephemeral.' },
  { id: 'w5', word: 'nostalgia',    pos: 'n.', meaning: '怀旧，乡愁', example: 'The old song filled me with nostalgia.' },
  { id: 'w6', word: 'meticulous',   pos: 'adj.', meaning: '一丝不苟的，细心的', example: 'She is meticulous about every detail.' },
  { id: 'w7', word: 'tranquil',     pos: 'adj.', meaning: '宁静的，安静的', example: 'The lake was tranquil at dawn.' },
  { id: 'w8', word: 'curious',      pos: 'adj.', meaning: '好奇的，感兴趣的', example: 'Children are naturally curious about the world.' },
  { id: 'w9', word: 'endeavor',     pos: 'v./n.', meaning: '努力，尽力', example: 'We endeavor to provide the best service.' },
  { id: 'w10', word: 'whimsical',   pos: 'adj.', meaning: '异想天开的，古怪的', example: 'He has a whimsical sense of humor.' },
];

function loadWords() {
  try {
    const r = localStorage.getItem(WORDS_KEY);
    if (r) {
      const arr = JSON.parse(r);
      if (Array.isArray(arr)) return arr;
    }
  } catch (e) {}
  return DEFAULT_WORDS.slice();
}

function loadCheckIn() {
  try {
    const r = localStorage.getItem(CHECKIN_KEY);
    if (r) {
      const arr = JSON.parse(r);
      if (Array.isArray(arr)) return arr;
    }
  } catch (e) {}
  return [];
}

function saveWords(words) {
  try { localStorage.setItem(WORDS_KEY, JSON.stringify(words)); } catch (e) {}
}
function saveCheckIn(list) {
  try { localStorage.setItem(CHECKIN_KEY, JSON.stringify(list)); } catch (e) {}
}

// 鼓励语
export const STUDY_ENCOURAGE = [
  '今天又多记了一个词，语言的风景又多了一寸。',
  '坚持比天赋更重要，你已经做到了。',
  '每一个单词都是一扇小窗，慢慢推开它。',
  '看似慢，其实每天都在前进，我看着呢。',
  '学到第几个了？不急，慢慢来，我陪你。',
];

export function pickEncourage() {
  return STUDY_ENCOURAGE[Math.floor(Math.random() * STUDY_ENCOURAGE.length)];
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const useStudyStore = create((set, get) => ({
  words: loadWords(),
  checkIn: loadCheckIn(),

  addWord: (data) => {
    const w = {
      id: `w-${Date.now()}`,
      word: (data.word || '').trim(),
      pos: (data.pos || '').trim(),
      meaning: (data.meaning || '').trim(),
      example: (data.example || '').trim(),
    };
    if (!w.word) return;
    const next = [w, ...get().words];
    set({ words: next });
    saveWords(next);
  },

  deleteWord: (id) => {
    const next = get().words.filter((w) => w.id !== id);
    set({ words: next });
    saveWords(next);
  },

  // 切换今日打卡：未打卡则打卡，已打卡则取消
  toggleCheckIn: () => {
    const today = todayStr();
    const list = get().checkIn;
    const exists = list.includes(today);
    const next = exists ? list.filter((d) => d !== today) : [...list, today];
    set({ checkIn: next });
    saveCheckIn(next);
    return !exists; // 返回是否变为已打卡
  },

  isTodayCheckedIn: () => get().checkIn.includes(todayStr()),

  // 连续打卡天数（含今天则到今天，否则到昨天为止）
  streak: () => {
    const list = get().checkIn;
    if (!list.length) return 0;
    const sorted = [...list].sort();
    let streak = 0;
    const d = new Date();
    // 如果今天没打卡，从昨天开始算
    const today = todayStr();
    if (!list.includes(today)) {
      d.setDate(d.getDate() - 1);
    }
    while (true) {
      const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (sorted.includes(s)) {
        streak += 1;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  },
}));
