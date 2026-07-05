import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbox from './Toolbox.jsx';

// 顶部导航栏：标题 Caleb + 脉冲(伙伴状态入口) + 齿轮(工具箱右侧滑出)
export default function TopBar() {
  const theme = useTheme();
  const t = theme.palette._;
  const [open, setOpen] = useState(false);
  const [initialTool, setInitialTool] = useState(null);

  const openToolbox = () => { setInitialTool(null); setOpen(true); };
  const openCompanion = () => { setInitialTool('companion'); setOpen(true); };
  const closeToolbox = () => { setOpen(false); setInitialTool(null); };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: t.surface,
          backgroundImage: 'none',
          borderBottom: `1px solid ${t.border}`,
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 52, md: 56 }, px: { xs: 1.5, md: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{ color: t.text, fontWeight: 600, fontSize: { xs: '1rem', md: '1.05rem' } }}
            >
              Caleb
            </Typography>
          </Box>

          {/* 脉冲标志：点击进 Caleb 的状态 */}
          <Tooltip title="Caleb的状态">
            <IconButton
              onClick={openCompanion}
              sx={{ p: 1, mr: 0.5, '&:hover': { bgcolor: t.subtle } }}
              aria-label="Caleb的状态"
            >
              <Box sx={{ position: 'relative', width: 14, height: 14 }}>
                <Box sx={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  bgcolor: '#22c55e', animation: 'pulse-ring 2s ease-out infinite',
                }} />
                <Box sx={{
                  position: 'absolute', inset: 2, borderRadius: '50%',
                  bgcolor: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }} />
              </Box>
            </IconButton>
          </Tooltip>

          {/* 齿轮按钮 */}
          <Tooltip title="工具箱">
            <IconButton
              onClick={openToolbox}
              sx={{
                color: t.muted,
                '&:hover': { bgcolor: t.subtle, color: t.text },
                transition: 'all 0.2s',
                '&:active': { transform: 'rotate(60deg)' },
              }}
              aria-label="工具箱"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* 工具箱：右侧滑出 Drawer（QQ 风侧边栏） */}
      <Drawer
        anchor="right"
        open={open}
        onClose={closeToolbox}
        PaperProps={{
          sx: {
            // 手机端全屏，桌面端 420px 侧栏
            width: { xs: '100vw', sm: 420, md: 460 },
            maxWidth: '100vw',
            bgcolor: 'transparent',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Toolbox open={open} onClose={closeToolbox} initialTool={initialTool} />
      </Drawer>
    </>
  );
}
