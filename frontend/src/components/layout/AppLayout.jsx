import { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import TopBar from './TopBar.jsx';
import Sidebar from '../sidebar/Sidebar.jsx';
import ChatWindow from '../chat/ChatWindow.jsx';

// 侧边栏宽度
const DRAWER_WIDTH = 280;

// 应用主布局：响应式 Drawer，颜色全部走 theme token
export default function AppLayout() {
  const theme = useTheme();
  const t = theme.palette._;
  // 桌面端（md 及以上）侧边栏常驻
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

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
        // 移动端：抽屉式侧边栏
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
          minWidth: 0, // 防止内容溢出
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
