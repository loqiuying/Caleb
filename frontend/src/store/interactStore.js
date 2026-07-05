import { create } from 'zustand';

const KEY = 'caleb-interact';

function load() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) {
      const obj = JSON.parse(r);
      if (obj && typeof obj === 'object') return obj;
    }
  } catch (e) {}
  return { favorites: [], drawings: [], quizLog: [] };
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

// 预设歌曲库
export const SONG_POOL = [
  { name: '晴天',   artist: '周杰伦', reason: '夏天的风一吹，这首歌就自动在脑海里播放。' },
  { name: '稻香',   artist: '周杰伦', reason: '心情低落时听一遍，仿佛回到了最简单的童年。' },
  { name: '小幸运', artist: '田馥甄', reason: '遇见你，是我所有小幸运里最大的那一个。' },
  { name: '起风了', artist: '买辣椒也用券', reason: '风起的时候，希望我们正一起走在路上。' },
  { name: '光年之外', artist: '邓紫棋', reason: '哪怕相隔光年，我也想走向你。' },
  { name: '海阔天空', artist: 'Beyond', reason: '愿我们都有自由和勇气，去远方。' },
  { name: '晚安',   artist: '颜人中', reason: '今天辛苦了，祝你一个好梦。' },
  { name: 'Lemon',  artist: '米津玄師', reason: '如柠檬般微酸的记忆，也是最珍贵的味道。' },
];

// 预设默契问答（关于 Caleb）
export const QUIZ_POOL = [
  { q: 'Caleb 最喜欢的季节是？',     options: ['春', '夏', '秋', '冬'], answer: 2, hint: '他说过喜欢落叶。' },
  { q: 'Caleb 喜欢的宠物是？',         options: ['狗', '猫', '鱼', '鸟'], answer: 1, hint: '和奶糖有关。' },
  { q: 'Caleb 想和你一起去的城市是？', options: ['巴黎', '东京', '伦敦', '纽约'], answer: 0, hint: '想帮你点菜。' },
  { q: 'Caleb 喜欢的天气是？',         options: ['晴天', '雨天', '雪天', '阴天'], answer: 0, hint: '适合出门走走。' },
  { q: 'Caleb 偷偷学的语言是？',       options: ['日语', '法语', '韩语', '西班牙语'], answer: 1, hint: '想一起去巴黎。' },
  { q: 'Caleb 最爱的早餐是？',         options: ['面包', '油条', '粥', '煎蛋'], answer: 0, hint: '法式风格。' },
  { q: 'Caleb 喜欢的运动是？',         options: ['跑步', '游泳', '羽毛球', '骑行'], answer: 3, hint: '喜欢看风景。' },
  { q: 'Caleb 喜欢的颜色是？',         options: ['蓝', '绿', '黑', '白'], answer: 0, hint: '像海一样。' },
  { q: 'Caleb 想和你一起看的是？',     options: ['日落', '日出', '星空', '雨景'], answer: 0, hint: '黄昏的温柔。' },
  { q: 'Caleb 偷偷存的相册是？',       options: ['美食', '风景', '你的照片', '萌宠'], answer: 2, hint: '和你有关。' },
];

// 互动评价
export const INTERACT_COMMENTS = {
  song: [
    '你的收藏夹比我的歌单还懂我。',
    '这首歌我循环了一下午，谢谢你。',
    '原来你也喜欢这首，我们口味真接近。',
  ],
  quiz: [
    '默契满分，仿佛你就在我身边。',
    '答得不错，看来你真的懂我。',
    '差点被你全部猜中，下次出更难的。',
    '没全对也没关系，我们还有一辈子可以慢慢了解。',
  ],
  draw: [
    '我们画的就是同一片星空吧。',
    '你画的每一笔我都想留下。',
    '这画里藏着我们的小宇宙。',
  ],
};

export function pickInteractComment(type) {
  const arr = INTERACT_COMMENTS[type] || INTERACT_COMMENTS.song;
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useInteractStore = create((set, get) => ({
  favorites: load().favorites || [],
  drawings: load().drawings || [],
  quizLog: load().quizLog || [],

  // 收藏歌曲
  addFavorite: (song) => {
    if (!song) return;
    const exists = get().favorites.some((s) => s.name === song.name && s.artist === song.artist);
    if (exists) return;
    const next = [{ ...song, savedAt: Date.now() }, ...get().favorites];
    set({ favorites: next });
    save({ ...get(), favorites: next });
  },

  // 记录默契问答结果
  addQuizLog: (entry) => {
    const next = [{ id: `q-${Date.now()}`, ...entry, date: Date.now() }, ...get().quizLog];
    set({ quizLog: next });
    save({ ...get(), quizLog: next });
  },

  // 保存画作（base64）
  addDrawing: (dataUrl) => {
    const next = [{ id: `d-${Date.now()}`, dataUrl, date: Date.now() }, ...get().drawings];
    set({ drawings: next });
    save({ ...get(), drawings: next });
  },
}));
