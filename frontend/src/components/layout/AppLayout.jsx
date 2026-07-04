import { useState, useEffect, useRef } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import TopBar from './TopBar.jsx';
import Sidebar from '../sidebar/Sidebar.jsx';
import ChatWindow from '../chat/ChatWindow.jsx';
import { useSessionStore } from '../../store/sessionStore.js';

// 侧边栏宽度
const DRAWER_WIDTH = 280;

// 应用主布局：响应式 Drawer，开屏自动进入聊天
export default function AppLayout() {
  const theme = useTheme();
  const t = theme.palette._;
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const sessions = useSessionStore((s) => s.sessions);
  const currentSessionId = useSessionStore((s) => s.currentSessionId);
  const selectSession = useSessionStore((s) => s.selectSession);

  // 自动选中第一个会话：仅在首次加载且有会话、且未选中时
  const initedRef = useRef(false);
  useEffect(() => {
    if (initedRef.current) return;
    if (sessions.length > 0 && !currentSessionId) {
      selectSession(sessions[0].id);
      initedRef.current = true;
    }
  }, [sessions, currentSessionId, selectSession]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleSelect = () => { if (!isDesktop) setMobileOpen(false); };

  const sidebar = <Sidebar onSelect={handleSelect} />;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: t.bg,
        color: t.text,
      }}
    >
      {/* 桌面端：常驻侧边栏 */}
      {isDesktop ? (
        <Box
          component="nav"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: `1px solid ${t.border}`,
            bgcolor: t.surface,
          }}
        >
          <Box sx={{ width: DRAWER_WIDTH, height: '100vh', position: 'sticky', top: 0 }}>
            {sidebar}
          </Box>
        </Box>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: t.surface,
              backgroundImage: 'none',
              borderRight: `1px solid ${t.border}`,
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: t.surface,
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      {/* 主区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: isDesktop ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          bgcolor: t.bg,
        }}
      >
        <TopBar onMenuClick={handleDrawerToggle} showMenuButton={!isDesktop} />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <ChatWindow />
        </Box>
      </Box>
    </Box>
  );
}
