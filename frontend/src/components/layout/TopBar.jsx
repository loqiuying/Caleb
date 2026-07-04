import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSessionStore } from '../../store/sessionStore.js';

// 顶部导航栏：深色背景，微信风格
export default function TopBar({ onMenuClick, showMenuButton }) {
  const currentSession = useSessionStore((s) => {
    const session = s.sessions.find((x) => x.id === s.currentSessionId);
    return session;
  });

  const title = currentSession?.title || 'AI 助手';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#13131a',
        backgroundImage: 'none',
        borderBottom: '1px solid #252530',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 52, md: 56 },
          px: { xs: 1.5, md: 2 },
        }}
      >
        {/* 移动端菜单/返回按钮 */}
        {showMenuButton && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 1,
              color: '#4FC3F7',
              '&:hover': { bgcolor: 'rgba(79,195,247,0.08)' },
            }}
            aria-label="菜单"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* 标题区域 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: '#ffffff',
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* 右侧状态点 */}
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#4FC3F7',
            boxShadow: '0 0 8px rgba(79,195,247,0.6)',
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
