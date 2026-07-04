import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import MarkdownRenderer from './MarkdownRenderer.jsx';

/**
 * 消息气泡（ChatGPT 风层次区分）
 *
 * 用户消息：右对齐，强调色软底气泡，圆角收尖指向头像
 * AI 消息：左对齐，无气泡，直接 Markdown 渲染 + 头像
 *   （无气泡给标题/列表/代码块留足排版空间）
 */
export default function MessageItem({ message }) {
  const theme = useTheme();
  const t = theme.palette._;
  const isUser = message.role === 'user';

  return (
    <Box
      className="message-fade-in"
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.25,
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
            ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`
            : `linear-gradient(135deg, ${t.accentHover} 0%, ${t.accent} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: 0.5,
          boxShadow: `0 2px 10px ${t.accentSoft}`,
        }}
      >
        {isUser ? '我' : 'AI'}
      </Box>

      {/* 消息体 */}
      {isUser ? (
        // 用户：强调色软底气泡
        <Box
          sx={{
            position: 'relative',
            maxWidth: { xs: '80%', md: '70%' },
            borderRadius: 2.5,
            px: 2,
            py: 1.25,
            bgcolor: t.bubbleUser,
            color: t.bubbleUserText,
            wordBreak: 'break-word',
            // 头像侧圆角收尖，指向头像
            borderTopRightRadius: 1.5,
            border: `1px solid ${t.accentSoft}`,
          }}
        >
          <Box
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              color: t.bubbleUserText,
            }}
          >
            {message.content}
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
                  bgcolor: t.accent,
                  animation: 'blink 1s step-end infinite',
                }}
              />
            )}
          </Box>
        </Box>
      ) : (
        // AI：无气泡，直接 Markdown 渲染
        <Box
          sx={{
            maxWidth: { xs: '88%', md: '80%' },
            color: t.text,
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
                height: 15,
                ml: 0.5,
                verticalAlign: 'text-bottom',
                bgcolor: t.accent,
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
