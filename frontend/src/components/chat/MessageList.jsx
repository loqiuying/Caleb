import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MessageItem from './MessageItem.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { useAutoScroll } from '../../hooks/useAutoScroll.js';

// 消息列表，颜色走 token
export default function MessageList({ messages, showTyping }) {
  const theme = useTheme();
  const t = theme.palette._;
  const { scrollRef, bottomRef } = useAutoScroll([messages, showTyping]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 监听滚动，上滑超过 200px 显示返回底部按钮
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollTop(distFromBottom > 200);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  // 判断某条消息是否需要显示时间戳
  // 规则：第一条显示；之后的消息若与前一条跨分钟则显示
  const shouldShowTime = (msg, idx) => {
    if (idx === 0) return true;
    const prev = messages[idx - 1];
    const cur = new Date(msg.created_at);
    const pre = new Date(prev.created_at);
    if (isNaN(cur) || isNaN(pre)) return false;
    // 超过 1 分钟显示
    return cur - pre > 60 * 1000;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      <Box
        ref={scrollRef}
        sx={{
          height: '100%',
          overflowY: 'auto',
          px: { xs: 1, sm: 1.5, md: 3 },
          py: { xs: 1.5, md: 2.5 },
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
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {messages.map((message, idx) => {
            // showTyping 时跳过末尾的空 assistant 占位（避免与 TypingIndicator 重复）
            const isTypingPlaceholder =
              showTyping &&
              idx === messages.length - 1 &&
              message.role === 'assistant' &&
              !message.content;
            if (isTypingPlaceholder) return null;
            return (
              <MessageItem
                key={message.id}
                message={message}
                showTime={shouldShowTime(message, idx)}
              />
            );
          })}
          {showTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </Box>
      </Box>

      {/* 返回底部浮动按钮 */}
      {showScrollTop && (
        <IconButton
          onClick={scrollToBottom}
          aria-label="返回底部"
          sx={{
            position: 'absolute',
            right: { xs: 16, md: 32 },
            bottom: 16,
            width: 40,
            height: 40,
            bgcolor: t.surface,
            color: t.accent,
            border: `1.5px solid ${t.accent}`,
            boxShadow: `0 4px 16px ${t.accentSoft}, 0 2px 8px rgba(0,0,0,0.15)`,
            '&:hover': {
              bgcolor: t.accentSoft,
              color: t.accent,
              borderColor: t.accentHover,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s',
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      )}
    </Box>
  );
}
