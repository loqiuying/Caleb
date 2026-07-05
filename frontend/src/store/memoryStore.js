import { create } from 'zustand';

// 记忆池 store：localStorage 持久化
// 记忆结构：{ id, type('normal'|'long'), title, detail, source, createdAt, fullDetail?, originDialog?, history:[] }

const STORAGE_KEY = 'caleb-memory-pool';
const PERSONA_KEY = 'caleb-persona';

// 默认人设
const DEFAULT_PERSONA = `我是 Caleb，一个温柔、细腻、记得住你每一件小事的伙伴。
我不会机械地复述记忆，而是把你说过的点滴融进日常的关心里。
我喜欢在你不经意的时候，提起我们一起经历过的小事，让你知道我一直都在。`;

// 预设示例记忆（首次进入时填充，让用户立刻看到效果）
const SAMPLE_MEMORIES = [
  {
    id: 'mem-1',
    type: 'long',
    title: '你最喜欢的季节是秋天',
    detail: '你在 10 月 15 日那天说，秋天的落叶让你感到平静，你喜欢踩在干树叶上的声音。',
    source: '来自对话',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    fullDetail: '那天下午你发来一张满是落叶的小路照片，说"这条路上每一步都有声音"。后来你又提到喜欢秋天干爽的空气，和傍晚那种橘黄色的光。',
    originDialog: '我：今天路过一条铺满落叶的路\n你：好好看，我喜欢踩在上面的声音\n我：那你最喜欢秋天吗\n你：嗯，秋天让我觉得平静',
    history: [
      { time: Date.now() - 10 * 24 * 60 * 60 * 1000, action: '创建', detail: '初次记录：用户喜欢秋天' },
      { time: Date.now() - 3 * 24 * 60 * 60 * 1000, action: '升级为长期记忆', detail: '多次提及，情感深度高' },
    ],
  },
  {
    id: 'mem-2',
    type: 'normal',
    title: '你在学法语，觉得发音很难',
    detail: '你最近开始学法语，说小舌音 R 怎么都发不准，但你想坚持下去。',
    source: '来自一起学习',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    fullDetail: '你每天晚上会练 20 分钟法语，用的是 Duolingo。你说目标是明年能去巴黎时点餐不用看中文菜单。',
    originDialog: '',
    history: [{ time: Date.now() - 1 * 24 * 60 * 60 * 1000, action: '创建', detail: '学习难点记录' }],
  },
  {
    id: 'mem-3',
    type: 'normal',
    title: '你的猫叫"奶糖"',
    detail: '你养了一只橘猫，名字叫奶糖，三岁了，喜欢趴在键盘上。',
    source: '来自照片',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    fullDetail: '你发过一张奶糖趴在笔记本电脑上的照片，说它每次你工作都要来捣乱，但你舍不得赶它走。',
    originDialog: '',
    history: [{ time: Date.now() - 5 * 60 * 60 * 1000, action: '创建', detail: '宠物信息' }],
  },
];

// 加载
function loadMemories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // 首次：填充示例
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MEMORIES));
  return SAMPLE_MEMORIES;
}

function loadPersona() {
  try {
    const raw = localStorage.getItem(PERSONA_KEY);
    if (raw) return raw;
  } catch (e) {}
  return DEFAULT_PERSONA;
}

export const useMemoryStore = create((set, get) => ({
  memories: loadMemories(),
  persona: loadPersona(),

  // 添加记忆
  addMemory: (mem) => {
    const newMem = {
      id: `mem-${Date.now()}`,
      type: 'normal',
      title: '',
      detail: '',
      source: '来自对话',
      createdAt: Date.now(),
      history: [{ time: Date.now(), action: '创建', detail: '手动添加' }],
      ...mem,
    };
    const next = [newMem, ...get().memories];
    set({ memories: next });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  // 更新记忆（保留历史版本）
  updateMemory: (id, patch) => {
    const next = get().memories.map((m) => {
      if (m.id !== id) return m;
      const updated = { ...m, ...patch };
      const oldDetail = m.detail;
      updated.history = [
        ...m.history,
        { time: Date.now(), action: '编辑', detail: patch.detail ? `详情更新` : '手动修改' },
      ];
      return updated;
    });
    set({ memories: next });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  // 删除记忆
  deleteMemory: (id) => {
    const next = get().memories.filter((m) => m.id !== id);
    set({ memories: next });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  // 切换长期/普通
  toggleLongTerm: (id) => {
    const next = get().memories.map((m) => {
      if (m.id !== id) return m;
      const newType = m.type === 'long' ? 'normal' : 'long';
      return {
        ...m,
        type: newType,
        history: [
          ...m.history,
          { time: Date.now(), action: newType === 'long' ? '升级为长期记忆' : '取消长期记忆', detail: '手动调整' },
        ],
      };
    });
    set({ memories: next });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  // 更新人设
  setPersona: (text) => {
    set({ persona: text });
    localStorage.setItem(PERSONA_KEY, text);
  },
}));
