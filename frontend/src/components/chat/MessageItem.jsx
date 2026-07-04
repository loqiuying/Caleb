import { Box, Typography } from '@mui/material';
import MarkdownRenderer from './MarkdownRenderer.jsx';

// 微信风格消息气泡
// 用户消息：右对齐，浅蓝色气泡（#4FC3F7），白色文字，小尖角指向右侧
// AI 消息：左对齐，深灰色气泡（#2A2A35），浅色文字，小尖角指向左侧
export default function MessageItem({ message }) {
  const isUser = message.role === 'user';

  // 用户首字母头像
  const userInitial = '我';

  return (
    <Box
      className="message-fade-in"
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1,
        width: '100%',
      }}
    >
      {/* 头像 */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          flexShrink: 0,
          background: isUser
            ? 'linear-gradient(135deg, #29B6F6 0%, #0288D1 100%)'
            : 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: isUser
            ? '0 2px 8px rgba(2,136,209,0.3)'
            : '0 2px 8px rgba(79,195,247,0.3)',
        }}
      >
        {isUser ? userInitial : 'AI'}
      </Box>

      {/* 消息气泡 + 尖角 */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: { xs: '80%', md: '70%' },
          borderRadius: 2,
          px: 1.75,
          py: 1.25,
          bgcolor: isUser ? '#4FC3F7' : '#2A2A35',
          color: isUser ? '#ffffff' : '#E8E8EE',
          wordBreak: 'break-word',
          // 用户气泡右上角圆角较小（贴近头像侧）
          // AI 气泡左上角圆角较小
          borderTopRightRadius: isUser ? 4 : 12,
          borderTopLeftRadius: isUser ? 12 : 4,
          boxShadow: isUser
            ? '0 2px 8px rgba(79,195,247,0.25)'
            : '0 2px 8px rgba(0,0,0,0.3)',
          // 小尖角
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 12,
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            ...(isUser
              ? {
                  right: -6,
                  borderLeft: '6px solid #4FC3F7',
                }
              : {
                  left: -6,
                  borderRight: '6px solid #2A2A35',
                }),
          },
        }}
      >
        {message.content ? (
          <MarkdownRenderer content={message.content} isUser={isUser} />
        ) : (
          <Typography
            variant="body2"
            sx={{ opacity: 0.6, fontSize: '0.95rem' }}
          >
            ...
          </Typography>
        )}

        {/* 流式光标 */}
        {message.streaming && message.content && (
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: 7,
              height: 14,
              ml: 0.5,
              verticalAlign: 'text-bottom',
              bgcolor: isUser ? '#ffffff' : '#4FC3F7',
              animation: 'blink 1s step-end infinite',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
