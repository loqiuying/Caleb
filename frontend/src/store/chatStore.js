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

  // 重新生成：基于最后一条 user 消息，重新请求 AI 回复
  // 移除最后一条 assistant 消息，重新启动流式（不重复添加 user 消息）
  regenerateLast: async (sessionId) => {
    const { messages, isStreaming } = get();
    if (isStreaming) return;

    // 找最后一条 user 消息
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;

    // 移除最后一条 assistant 消息（如果有）
    let newMessages = messages;
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      newMessages = messages.slice(0, -1);
    }

    // 新 assistant 占位
    const assistantMessage = {
      id: `temp-assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      streaming: true,
    };

    set({
      messages: [...newMessages, assistantMessage],
      isStreaming: true,
      streamingContent: '',
      error: null,
    });

    const controller = streamChat(
      sessionId,
      lastUser.content,
      (token) => {
        set((state) => {
          const newContent = state.streamingContent + token;
          return {
            streamingContent: newContent,
            messages: state.messages.map((m) =>
              m.id === assistantMessage.id ? { ...m, content: newContent } : m
            ),
          };
        });
      },
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
      (error) => {
        console.error('重新生成失败:', error);
        set((state) => ({
          isStreaming: false,
          streamingContent: '',
          _controller: null,
          error: error.message,
          messages: state.messages.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, streaming: false, content: m.content || `（出错了：${error.message}）` }
              : m
          ),
        }));
      }
    );

    set({ _controller: controller });
  },

  // 重发：从指定 user 消息重新请求
  // 移除该消息及其后所有消息，重新 sendMessage
  resendFromMessage: async (sessionId, messageId) => {
    const { messages, isStreaming } = get();
    if (isStreaming) return;

    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx === -1) return;
    const target = messages[idx];
    if (target.role !== 'user') return;

    // 移除该消息及之后所有消息
    const kept = messages.slice(0, idx);
    set({ messages: kept, streamingContent: '', error: null });

    // 重新发送（sendMessage 会追加 user + assistant 占位并启动流）
    get().sendMessage(sessionId, target.content);
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
