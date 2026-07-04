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
  const { messages, isStreaming, loadMessages, sendMessage } = useChatStore();

  useEffect(() => {
    if (currentSessionId) loadMessages(currentSessionId);
  }, [currentSessionId, loadMessages]);

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
