import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore.js';
import { useChatStore } from '../../store/chatStore.js';
import EmptyState from '../layout/EmptyState.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';

// 聊天主区域
export default function ChatWindow() {
  const theme = useTheme();
  const t = theme.palette._;
  const currentSessionId = useSessionStore((s) => s.currentSessionId);
  const { messages, isStreaming, loadMessages, sendMessage, regenerateLast } = useChatStore();

  useEffect(() => {
    if (currentSessionId) loadMessages(currentSessionId);
  }, [currentSessionId, loadMessages]);

  // 监听"重新生成"事件（由 AI 消息工具条触发）
  useEffect(() => {
    const handler = () => {
      if (currentSessionId) regenerateLast(currentSessionId);
    };
    window.addEventListener('message:regenerate', handler);
    return () => window.removeEventListener('message:regenerate', handler);
  }, [currentSessionId, regenerateLast]);

  if (!currentSessionId) return <EmptyState />;

  const handleSend = (content) => sendMessage(currentSessionId, content);

  const showTyping =
    isStreaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    !messages[messages.length - 1].content;

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
      <MessageList messages={messages} showTyping={showTyping} />
      <MessageInput onSend={handleSend} disabled={isStreaming} />
    </Box>
  );
}
