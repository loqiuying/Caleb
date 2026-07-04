import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore.js';
import { useColorMode } from '../../App.jsx';

// 顶部导航栏：颜色走 token，右侧带深浅色切换
export default function TopBar({ onMenuClick, showMenuButton }) {
  const theme = useTheme();
  const t = theme.palette._;
  const { mode, toggle } = useColorMode();

  const currentSession = useSessionStore((s) => {
    const session = s.sessions.find((x) => x.id === s.currentSessionId);
    return session;
  });
  const title = currentSession?.title || 'Caleb';

  return (
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
        {/* 移动端菜单按钮 */}
        {showMenuButton && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 1,
              color: t.accent,
              '&:hover': { bgcolor: t.accentSoft },
            }}
            aria-label="菜单"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* 标题区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: t.text,
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.05rem' },
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* 右侧：在线状态点 + 主题切换 */}
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#22c55e',
            mr: 1.5,
            boxShadow: '0 0 8px rgba(34,197,94,0.6)',
          }}
        />
        <Tooltip title={mode === 'dark' ? '切换到浅色' : '切换到深色'}>
          <IconButton
            onClick={toggle}
            sx={{
              color: t.muted,
              '&:hover': { bgcolor: t.subtle, color: t.text },
              transition: 'all 0.2s',
            }}
            aria-label="切换主题"
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
