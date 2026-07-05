import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore.js';
import { useChatStore } from '../../store/chatStore.js';
import EmptyState from '../layout/EmptyState.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import { useSummaryStore } from '../../store/summaryStore.js';

// 聊天主区域：单一聊天框，会话由 AppLayout 初始化
export default function ChatWindow() {
  const theme = useTheme();
  const t = theme.palette._;
  const currentSessionId = useSessionStore((s) => s.currentSessionId);
  const loading = useSessionStore((s) => s.loading);
  const { messages, isStreaming, loadMessages, sendMessage, regenerateLast, resendFromMessage } = useChatStore();
  const checkAndSummarize = useSummaryStore((s) => s.checkAndSummarize);

  useEffect(() => {
    if (currentSessionId) loadMessages(currentSessionId);
  }, [currentSessionId, loadMessages]);

  // 消息变化时检查是否需要自动总结
  useEffect(() => {
    if (messages.length >= 50) checkAndSummarize();
  }, [messages, checkAndSummarize]);

  // 监听"重新生成" + "重发" 事件
  useEffect(() => {
    const regenHandler = () => {
      if (currentSessionId) regenerateLast(currentSessionId);
    };
    const resendHandler = (e) => {
      if (currentSessionId && e.detail?.id) {
        resendFromMessage(currentSessionId, e.detail.id, e.detail.content);
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

  const handleSend = (content) => {
    if (currentSessionId) sendMessage(currentSessionId, content);
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
        <EmptyState loading={loading} />
      )}
      <MessageInput onSend={handleSend} disabled={isStreaming || !currentSessionId} />
    </Box>
  );
}
