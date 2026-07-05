import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Popover, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbox from './Toolbox.jsx';

// 顶部导航栏：单标题 Caleb + 齿轮工具箱（无侧边栏菜单）
export default function TopBar() {
  const theme = useTheme();
  const t = theme.palette._;
  const [toolboxEl, setToolboxEl] = useState(null);

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
        {/* 标题 + 版本标记 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ color: t.text, fontWeight: 600, fontSize: { xs: '1rem', md: '1.05rem' } }}
          >
            Caleb
          </Typography>
          <Box
            sx={{
              bgcolor: '#ef4444',
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 700,
              px: 0.6,
              py: 0.15,
              borderRadius: 1,
              lineHeight: 1,
            }}
          >
            v5
          </Box>
        </Box>

        {/* 右侧：在线状态点 + 齿轮按钮 */}
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
        <Tooltip title="工具箱">
          <IconButton
            onClick={(e) => setToolboxEl(e.currentTarget)}
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

        {/* 工具箱浮层 */}
        <Popover
          open={Boolean(toolboxEl)}
          anchorEl={toolboxEl}
          onClose={() => setToolboxEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', mt: 1 } }}
        >
          <Toolbox open={Boolean(toolboxEl)} anchorEl={toolboxEl} onClose={() => setToolboxEl(null)} />
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
