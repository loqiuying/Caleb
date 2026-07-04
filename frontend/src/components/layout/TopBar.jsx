import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useSessionStore } from '../../store/sessionStore.js';

// 顶部导航栏
export default function TopBar({ onMenuClick, showMenuButton }) {
  const currentSession = useSessionStore((s) => {
    const session = s.sessions.find((x) => x.id === s.currentSessionId);
    return session;
  });

  const title = currentSession?.title || 'AI 聊天助手';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        borderBottom: '1px solid',
        borderColor: 'primary.dark',
      }}
    >
      <Toolbar>
        {/* 移动端菜单按钮 */}
        {showMenuButton && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1 }}
            aria-label="菜单"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* 应用图标 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
          <SmartToyIcon sx={{ color: 'common.white' }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: 'common.white',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
