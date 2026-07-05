import { useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import TopBar from './TopBar.jsx';
import ChatWindow from '../chat/ChatWindow.jsx';
import { useSessionStore } from '../../store/sessionStore.js';

// 应用主布局：单聊天框，无侧边栏（去多会话）
export default function AppLayout() {
  const theme = useTheme();
  const t = theme.palette._;
  const initSingleSession = useSessionStore((s) => s.initSingleSession);

  // 启动时初始化唯一会话
  useEffect(() => {
    initSingleSession();
  }, [initSingleSession]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: t.bg,
        color: t.text,
      }}
    >
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          bgcolor: t.bg,
        }}
      >
        <ChatWindow />
      </Box>
    </Box>
  );
}
