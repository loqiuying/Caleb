import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore.js';
import { useChatStore } from '../../store/chatStore.js';
import EmptyState from '../layout/EmptyState.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';

// 聊天主区域
export default function ChatWindow() {
  const currentSessionId = useSessionStore((s) => s.currentSessionId);
  const { messages, isStreaming, loadMessages, sendMessage } = useChatStore();

  // 切换会话时加载历史消息
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId, loadMessages]);

  // 无选中会话：显示空状态
  if (!currentSessionId) {
    return <EmptyState />;
  }

  // 发送消息
  const handleSend = (content) => {
    sendMessage(currentSessionId, content);
  };

  // 是否显示"思考中"动画（流式中且 assistant 内容为空）
  const showTyping = isStreaming && messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    !messages[messages.length - 1].content;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        bgcolor: 'background.default',
      }}
    >
      {/* 消息列表 */}
      <MessageList messages={messages} showTyping={showTyping} />

      {/* 输入区域 */}
      <MessageInput onSend={handleSend} disabled={isStreaming} />
    </Box>
  );
}
