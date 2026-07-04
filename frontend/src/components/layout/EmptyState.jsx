import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore.js';

// 空状态：极简聊天准备态（微信风，无欢迎页元素）
// 没选中会话时显示，底部仍有输入框可直接发消息（由 ChatWindow 提供）
export default function EmptyState() {
  const theme = useTheme();
  const t = theme.palette._;
  const sessions = useSessionStore((s) => s.sessions);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: t.bg,
        color: t.text,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.85rem',
          color: t.muted,
          opacity: 0.7,
        }}
      >
        {sessions.length === 0
          ? '开始和 Caleb 对话吧'
          : '选择左侧会话，或直接发消息开始新对话'}
      </Typography>
    </Box>
  );
}
