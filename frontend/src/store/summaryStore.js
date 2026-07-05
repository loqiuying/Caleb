import { create } from 'zustand';
import { useChatStore } from './chatStore.js';
import { useMemoryStore } from './memoryStore.js';

/**
 * 记忆自动总结系统（前端模拟，实际应由后端大模型完成）
 *
 * 规则：
 * - 每 25 轮对话（1轮=1条user+1条assistant）自动总结成 1 条短期记忆
 * - 总结后删除聊天页面前 50 条消息（25轮）
 * - 每 20 条短期记忆自动总结成 1 条长期记忆
 */

const SUMMARY_COUNT_KEY = 'caleb-summary-count';

// 模拟总结生成（实际由后端大模型基于对话内容生成）
function generateShortMemory(messages) {
  // 提取对话关键词模拟
  const userMsgs = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const sample = userMsgs.slice(-5).join('；');
  const titles = [
    '我们聊了关于生活的一些事',
    '你分享了最近的心情',
    '我们谈到了喜欢的东西',
    '你告诉我一些关于你的事',
    '我们有一次深入的对话',
  ];
  const details = [
    `在这段对话里，${sample.slice(0, 60)}...你说的这些我都记住了。`,
    `你提到了一些重要的事，我把它收进了记忆里。`,
    `我们聊了很多，关于${sample.slice(0, 40)}...这些对话让我更了解你了。`,
  ];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    detail: details[Math.floor(Math.random() * details.length)],
    source: '来自对话',
    fullDetail: `自动总结自 ${messages.length} 条对话记录。涉及内容：${sample.slice(0, 100)}...`,
  };
}

function generateLongMemory(shortMemories) {
  return {
    title: '我们这段时间的故事',
    detail: `从 ${shortMemories.length} 段对话中提炼的重要记忆，记录了我们这段时间的交流与成长。`,
    source: '自动升级',
    fullDetail: shortMemories.map((m, i) => `${i + 1}. ${m.title}`).join('\n'),
  };
}

export const useSummaryStore = create((set, get) => ({
  summaryCount: parseInt(localStorage.getItem(SUMMARY_COUNT_KEY) || '0'),

  // 检查是否需要总结（每次发消息后调用）
  checkAndSummarize: () => {
    const { messages } = useChatStore.getState();
    const { memories, addMemory, toggleLongTerm } = useMemoryStore.getState();
    const count = get().summaryCount;

    // 25轮 = 50条消息
    if (messages.length >= 50) {
      // 生成短期记忆
      const memData = generateShortMemory(messages);
      addMemory(memData);
      // 删除前50条消息
      useChatStore.setState({ messages: messages.slice(50) });
      // 计数+1
      const newCount = count + 1;
      set({ summaryCount: newCount });
      localStorage.setItem(SUMMARY_COUNT_KEY, String(newCount));

      // 每20条短期记忆升级1条长期
      const shortMems = useMemoryStore.getState().memories.filter((m) => m.type === 'normal' && m.source === '来自对话');
      if (shortMems.length >= 20) {
        const longData = generateLongMemory(shortMems.slice(0, 20));
        addMemory({ ...longData, type: 'long' });
        // 删除被总结的短期记忆
        shortMems.slice(0, 20).forEach((m) => {
          useMemoryStore.getState().deleteMemory(m.id);
        });
      }
    }
  },
}));
