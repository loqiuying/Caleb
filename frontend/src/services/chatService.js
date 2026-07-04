import { API_BASE_URL } from './api.js';

// 聊天 SSE 流式接收
// 使用 fetch + ReadableStream 解析 Server-Sent Events
//
// SSE 数据格式：
//   event: token\ndata: {"content":"xxx"}\n\n
//   event: done\ndata: {}\n\n
//   event: error\ndata: {"message":"xxx"}\n\n
//
// 参数：
//   sessionId - 会话 ID
//   message   - 用户发送的消息
//   onToken   - 收到 token 回调 (content) => void
//   onDone    - 流结束回调 () => void
//   onError   - 出错回调 (error) => void
// 返回：AbortController（可用于中止请求）
export function streamChat(sessionId, message, onToken, onDone, onError) {
  const controller = new AbortController();
  const url = `${API_BASE_URL}/chat`;

  (async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ sessionId, message }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '请求失败');
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      if (!response.body) {
        throw new Error('浏览器不支持 ReadableStream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      // 读取流数据
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 按空行分割 SSE 消息块
        const chunks = buffer.split('\n\n');
        // 最后一块可能不完整，保留在 buffer
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
          const parsed = parseSSEChunk(chunk);
          if (!parsed) continue;

          if (parsed.event === 'token') {
            const content = parsed.data?.content || '';
            if (content) onToken?.(content);
          } else if (parsed.event === 'done') {
            onDone?.();
            return;
          } else if (parsed.event === 'error') {
            const errMsg = parsed.data?.message || '服务器返回错误';
            throw new Error(errMsg);
          }
        }
      }

      // 流自然结束，视为 done
      onDone?.();
    } catch (error) {
      // 用户主动中止不视为错误
      if (error.name === 'AbortError') {
        return;
      }
      onError?.(error);
    }
  })();

  return controller;
}

// 解析单个 SSE 消息块
function parseSSEChunk(chunk) {
  const lines = chunk.split('\n');
  let event = 'message';
  let dataStr = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('event:')) {
      event = trimmed.slice(6).trim();
    } else if (trimmed.startsWith('data:')) {
      dataStr += trimmed.slice(5).trim();
    }
  }

  let data = {};
  if (dataStr) {
    try {
      data = JSON.parse(dataStr);
    } catch {
      data = { content: dataStr };
    }
  }

  return { event, data };
}
