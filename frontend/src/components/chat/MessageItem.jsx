import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import MessageActions from './MessageActions.jsx';

/**
 * 消息气泡（微信/QQ 个人聊天风格）
 *
 * 用户：右侧，微信绿气泡，深色文字，右尖角
 * AI：左侧，白色气泡（深色下为深灰），左尖角，下方带 hover 工具条
 */
export default function MessageItem({ message }) {
  const theme = useTheme();
  const t = theme.palette._;
  const isUser = message.role === 'user';

  // 气泡本体（用户和 AI 共用）
  const bubble = (
    <Box
      sx={{
        position: 'relative',
        maxWidth: { xs: '78%', md: '68%' },
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
            bgcolor: isUser ? t.bubbleUserText : t.accent,
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}
    </Box>
  );

  // AI：气泡 + 下方工具条（列布局）
  if (!isUser) {
    return (
      <Box
        className="message-fade-in"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 1.25,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 1.5,
            flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          AI
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: { xs: '82%', md: '72%' } }}>
          {bubble}
          {message.content && !message.streaming && <MessageActions message={message} />}
        </Box>
      </Box>
    );
  }

  // 用户：头像 + 气泡（反向）
  return (
    <Box
      className="message-fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        gap: 1.25,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 1.5,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 700,
        }}
      >
        我
      </Box>
      {bubble}
    </Box>
  );
}
