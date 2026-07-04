import { create } from 'zustand';
import { sessionService } from '../services/sessionService.js';
import { streamChat } from '../services/chatService.js';

// 聊天状态管理
export const useChatStore = create((set, get) => ({
  // 消息列表
  messages: [],
  // 是否正在流式接收
  isStreaming: false,
  // 当前流式接收的内容（实时拼接）
  streamingContent: '',
  // 错误信息
  error: null,
  // 当前 AbortController（用于中止流）
  _controller: null,

  // 加载历史消息
  loadMessages: async (sessionId) => {
    set({ messages: [], error: null });
    try {
      const res = await sessionService.getMessages(sessionId, 50);
      const list = Array.isArray(res) ? res : res.data || res.messages || [];
      // 规范化消息格式
      const messages = list.map(normalizeMessage);
      set({ messages });
    } catch (error) {
      console.error('加载消息失败:', error);
      set({ error: error.message });
    }
  },

  // 发送消息（流式）
  sendMessage: async (sessionId, content) => {
    if (!content.trim() || get().isStreaming) return;

    // 添加用户消息
    const userMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    // 创建 assistant 占位消息
    const assistantMessage = {
      id: `temp-assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      streaming: true,
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
      isStreaming: true,
      streamingContent: '',
      error: null,
    }));

    // 启动 SSE 流
    const controller = streamChat(
      sessionId,
      content.trim(),
      // onToken：追加内容到当前 assistant 消息
      (token) => {
        set((state) => {
          const newContent = state.streamingContent + token;
          const messages = state.messages.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: newContent }
              : m
          );
          return { messages, streamingContent: newContent };
        });
      },
      // onDone：完成流式
      () => {
        set((state) => ({
          isStreaming: false,
          streamingContent: '',
          _controller: null,
          messages: state.messages.map((m) =>
            m.id === assistantMessage.id ? { ...m, streaming: false } : m
          ),
        }));
      },
      // onError：错误处理
      (error) => {
        console.error('流式接收失败:', error);
        set((state) => ({
          isStreaming: false,
          streamingContent: '',
          _controller: null,
          error: error.message,
          messages: state.messages.map((m) =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  streaming: false,
                  content:
                    m.content ||
                    `（出错了：${error.message}）`,
                }
              : m
          ),
        }));
      }
    );

    set({ _controller: controller });
  },

  // 中止当前流
  abortStream: () => {
    const controller = get()._controller;
    if (controller) {
      controller.abort();
    }
    set((state) => ({
      isStreaming: false,
      streamingContent: '',
      _controller: null,
      messages: state.messages.map((m) =>
        m.streaming ? { ...m, streaming: false } : m
      ),
    }));
  },

  // 清空消息
  clearMessages: () => {
    set({ messages: [], streamingContent: '', error: null });
  },
}));

// 规范化消息格式（兼容后端字段名）
function normalizeMessage(msg) {
  return {
    id: msg.id || msg._id || `msg-${Math.random().toString(36).slice(2)}`,
    role: msg.role || (msg.isUser ? 'user' : 'assistant'),
    content: msg.content || msg.text || '',
    created_at: msg.created_at || msg.createdAt || msg.timestamp || null,
    streaming: false,
  };
}
