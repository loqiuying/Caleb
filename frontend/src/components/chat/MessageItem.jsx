import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import MessageActions from './MessageActions.jsx';

/**
 * 消息气泡（无头像）
 *
 * 用户：右侧，微信绿气泡，右尖角
 * AI：左侧，白色气泡，左尖角，下方带 hover 工具条
 */
export default function MessageItem({ message, showTime }) {
  const theme = useTheme();
  const t = theme.palette._;
  const isUser = message.role === 'user';

  return (
    <Box className="message-fade-in" sx={{ width: '100%' }}>
      {/* 时间戳：居中显示 */}
      {showTime && message.created_at && (
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: t.muted,
            mb: 1,
            opacity: 0.8,
          }}
        >
          {formatChatTime(message.created_at)}
        </Typography>
      )}

      {/* 消息行：无头像，直接左右对齐 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: { xs: '80%', sm: '78%', md: '68%' },
            alignItems: isUser ? 'flex-end' : 'flex-start',
          }}
        >
          {/* 气泡 */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              px: 2,
              py: 1.25,
              bgcolor: isUser ? t.bubbleUser : t.bubbleAi,
              color: isUser ? t.bubbleUserText : t.bubbleAiText,
              border: isUser ? 'none' : `1px solid ${t.bubbleAiBorder}`,
              wordBreak: 'break-word',
              borderTopRightRadius: isUser ? 0.5 : 2,
              borderTopLeftRadius: isUser ? 2 : 0.5,
              boxShadow: theme.palette.mode === 'light'
                ? '0 1px 2px rgba(0,0,0,0.08)'
                : '0 1px 2px rgba(0,0,0,0.3)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 14,
                width: 0,
                height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                ...(isUser
                  ? { right: -7, borderLeft: `7px solid ${t.bubbleUser}` }
                  : { left: -7, borderRight: `7px solid ${t.bubbleAi}` }),
              },
            }}
          >
            {message.content ? (
              <MarkdownRenderer content={message.content} isUser={isUser} />
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.5, fontSize: '0.95rem' }}>
                ...
              </Typography>
            )}

            {message.streaming && message.content && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 7,
                  height: 14,
                  ml: 0.5,
                  verticalAlign: 'text-bottom',
                  bgcolor: isUser ? t.bubbleUserText : t.accent,
                  animation: 'blink 1s step-end infinite',
                }}
              />
            )}
          </Box>

          {message.content && !message.streaming && (
            <MessageActions message={message} isUser={isUser} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

// 微信风时间格式
function formatChatTime(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const time = `${hh}:${mm}`;

  if (date.toDateString() === now.toDateString()) return time;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `昨天 ${time}`;

  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (now - date < oneWeek) return `${weekDay} ${time}`;

  return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
}
