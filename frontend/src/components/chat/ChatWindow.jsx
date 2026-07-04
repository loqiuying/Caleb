import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore.js';
import { useChatStore } from '../../store/chatStore.js';
import EmptyState from '../layout/EmptyState.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';

// 聊天主区域：永远显示输入框（微信风），没会话时发消息自动创建
export default function ChatWindow() {
  const theme = useTheme();
  const t = theme.palette._;
  const currentSessionId = useSessionStore((s) => s.currentSessionId);
  const createSession = useSessionStore((s) => s.createSession);
  const { messages, isStreaming, loadMessages, sendMessage, regenerateLast, resendFromMessage } = useChatStore();

  useEffect(() => {
    if (currentSessionId) loadMessages(currentSessionId);
  }, [currentSessionId, loadMessages]);

  // 监听"重新生成" + "重发" 事件
  useEffect(() => {
    const regenHandler = () => {
      if (currentSessionId) regenerateLast(currentSessionId);
    };
    const resendHandler = (e) => {
      if (currentSessionId && e.detail?.id) {
        resendFromMessage(currentSessionId, e.detail.id);
      }
    };
    window.addEventListener('message:regenerate', regenHandler);
    window.addEventListener('message:resend', resendHandler);
    return () => {
      window.removeEventListener('message:regenerate', regenHandler);
      window.removeEventListener('message:resend', resendHandler);
    };
  }, [currentSessionId, regenerateLast, resendFromMessage]);

  const showTyping =
    isStreaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    !messages[messages.length - 1].content;

  // 发送消息：没会话时先创建
  const handleSend = async (content) => {
    let sid = currentSessionId;
    if (!sid) {
      try {
        const s = await createSession('新对话');
        sid = s.id;
      } catch (error) {
        console.error('创建会话失败:', error);
        return;
      }
    }
    sendMessage(sid, content);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        bgcolor: t.bg,
      }}
    >
      {currentSessionId ? (
        <MessageList messages={messages} showTyping={showTyping} />
      ) : (
        <EmptyState />
      )}
      <MessageInput onSend={handleSend} disabled={isStreaming} />
    </Box>
  );
}
