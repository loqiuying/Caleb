import { Box, Paper, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MarkdownRenderer from './MarkdownRenderer.jsx';

// 消息气泡
export default function MessageItem({ message }) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.5,
        width: '100%',
      }}
    >
      {/* 头像 */}
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          width: 36,
          height: 36,
          flexShrink: 0,
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>

      {/* 消息气泡 */}
      <Paper
        elevation={1}
        sx={{
          maxWidth: { xs: '80%', md: '70%' },
          px: 2.5,
          py: 1.5,
          borderRadius: 2,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'common.white' : 'text.primary',
          // 流式时显示光标
          position: 'relative',
          wordBreak: 'break-word',
          boxShadow: isUser
            ? '0px 2px 8px rgba(25,118,210,0.20)'
            : '0px 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {message.content ? (
          <MarkdownRenderer content={message.content} isUser={isUser} />
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            ...
          </Typography>
        )}

        {/* 流式光标 */}
        {message.streaming && message.content && (
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: 8,
              height: 16,
              ml: 0.5,
              bgcolor: isUser ? 'common.white' : 'primary.main',
              verticalAlign: 'text-bottom',
              animation: 'blink 1s step-end infinite',
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
