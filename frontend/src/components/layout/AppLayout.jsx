import { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import TopBar from './TopBar.jsx';
import Sidebar from '../sidebar/Sidebar.jsx';
import ChatWindow from '../chat/ChatWindow.jsx';

// 侧边栏宽度
const DRAWER_WIDTH = 280;

// 应用主布局：响应式 Drawer
export default function AppLayout() {
  const theme = useTheme();
  // 桌面端（md 及以上）侧边栏常驻
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // 切换移动端抽屉
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // 选中会话后关闭移动端抽屉
  const handleSelect = () => {
    if (!isDesktop) setMobileOpen(false);
  };

  // 侧边栏内容
  const sidebar = <Sidebar onSelect={handleSelect} />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 桌面端：常驻侧边栏 */}
      {isDesktop ? (
        <Box
          component="nav"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
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
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
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
        }}
      >
        <TopBar onMenuClick={handleDrawerToggle} showMenuButton={!isDesktop} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* 聊天窗口 */}
          <ChatWindow />
        </Box>
      </Box>
    </Box>
  );
}
