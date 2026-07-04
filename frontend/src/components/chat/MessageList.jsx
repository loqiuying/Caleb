import { Box } from '@mui/material';
import { useTheme } from '@mui/material';
import MessageItem from './MessageItem.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { useAutoScroll } from '../../hooks/useAutoScroll.js';

// 消息列表，颜色走 token
export default function MessageList({ messages, showTyping }) {
  const theme = useTheme();
  const t = theme.palette._;
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
        bgcolor: t.bg,
      }}
    >
      <Box
        sx={{
          maxWidth: 820,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {showTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </Box>
    </Box>
  );
}
