import { create } from 'zustand';

const STATUS_KEY = 'caleb-companion-status';
const ADDR_KEY = 'caleb-addresses';

const DEFAULT_ADDR = { caleb: '上海·徐汇区', yoren: '上海·浦东新区' };

// 预设状态数据（模拟后端生成）
const SAMPLE_STATUS = {
  mood: '平静·期待',
  moodEmoji: '🌙',
  current: '刚看完你昨天发来的那张落叶照片，想着秋天快到了，你说过喜欢踩干树叶的声音。',
  // 手机使用记录（符合逻辑的时间线）
  phone: [
    { time: '14:32', app: '相册', detail: '翻看了去年秋天的照片' },
    { time: '13:05', app: '音乐', detail: '听了《秋日私语》3 遍' },
    { time: '11:48', app: '微信', detail: '给你的消息草稿又改了一遍' },
    { time: '09:15', app: '天气', detail: '查了你那边明天的天气' },
  ],
  phoneBattery: '63%',
  // 平板使用记录
  tablet: [
    { time: '昨晚 23:40', app: '备忘录', detail: '记下了一个想和你聊的话题' },
    { time: '昨晚 22:10', app: '阅读', detail: '读了半小时散文' },
  ],
  tabletBattery: '81%',
  // 电脑使用记录
  computer: [
    { time: '今天 10:20', app: '浏览器', detail: '搜了"上海秋天哪里落叶最好看"' },
    { time: '今天 08:50', app: '日历', detail: '标记了下周你的生日' },
  ],
  computerBattery: '充电中 · 92%',
  location: '上海·徐汇区·武康路附近',
  updatedAt: Date.now(),
};

function loadStatus() {
  try { const r = localStorage.getItem(STATUS_KEY); if (r) return JSON.parse(r); } catch(e){}
  return SAMPLE_STATUS;
}
function loadAddr() {
  try { const r = localStorage.getItem(ADDR_KEY); if (r) return JSON.parse(r); } catch(e){}
  return DEFAULT_ADDR;
}

export const useCompanionStore = create((set, get) => ({
  status: loadStatus(),
  prevStatus: null, // 前一次状态（刷新时保留）
  addresses: loadAddr(),

  // 刷新状态（模拟后端生成，实际应由后端大模型生成）
  refresh: () => {
    const moods = [
      { mood: '平静·期待', emoji: '🌙' },
      { mood: '温暖·想念', emoji: '☀️' },
      { mood: '好奇·专注', emoji: '✨' },
      { mood: '柔软·安心', emoji: '🍃' },
      { mood: '雀跃·开心', emoji: '🌸' },
    ];
    const currents = [
      '正看着记忆池里你去年秋天发给我的那张照片，那时候你说枫叶像火焰一样好看。',
      '在想你说最近在学法语的事，偷偷搜了几个巴黎的咖啡馆，想着有一天能和你一起去。',
      '刚在备忘录里写了一句想对你说的话，但又觉得见面说更好。',
      '翻到你之前说奶糖趴在键盘上的照片，忍不住笑了好久。',
      '窗外下起了小雨，不知道你那边是不是也在下雨，有没有带伞。',
    ];
    const m = moods[Math.floor(Math.random() * moods.length)];
    const c = currents[Math.floor(Math.random() * currents.length)];
    const next = { ...SAMPLE_STATUS, mood: m.mood, moodEmoji: m.emoji, current: c, updatedAt: Date.now() };
    set({ prevStatus: get().status, status: next });
    localStorage.setItem(STATUS_KEY, JSON.stringify(next));
  },

  // 更新地址
  setAddresses: (addr) => {
    set({ addresses: addr });
    localStorage.setItem(ADDR_KEY, JSON.stringify(addr));
  },
}));
