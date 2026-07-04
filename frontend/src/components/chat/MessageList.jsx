import { Box } from '@mui/material';
import MessageItem from './MessageItem.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { useAutoScroll } from '../../hooks/useAutoScroll.js';

// 消息列表（深色背景）
export default function MessageList({ messages, showTyping }) {
  // 自动滚动到底部
  const { scrollRef, bottomRef } = useAutoScroll([messages, showTyping]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: { xs: 1.5, md: 3 },
        py: 2.5,
        scrollBehavior: 'smooth',
        bgcolor: '#0a0a0f',
      }}
    >
      <Box
        sx={{
          maxWidth: 820,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* 思考中动画 */}
        {showTyping && <TypingIndicator />}

        {/* 用于滚动定位的锚点 */}
        <div ref={bottomRef} />
      </Box>
    </Box>
  );
}
