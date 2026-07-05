import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Popover, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbox from './Toolbox.jsx';

// 顶部导航栏：标题 Caleb + 脉冲(伙伴状态入口) + 齿轮(工具箱)
export default function TopBar() {
  const theme = useTheme();
  const t = theme.palette._;
  const [toolboxEl, setToolboxEl] = useState(null);
  const [initialTool, setInitialTool] = useState(null);

  // 打开工具箱（齿轮）
  const openToolbox = (e) => {
    setInitialTool(null);
    setToolboxEl(e.currentTarget);
  };
  // 打开伙伴状态（脉冲）
  const openCompanion = (e) => {
    setInitialTool('companion');
    setToolboxEl(e.currentTarget);
  };
  const closeToolbox = () => {
    setToolboxEl(null);
    setInitialTool(null);
  };

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
        {/* 标题 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ color: t.text, fontWeight: 600, fontSize: { xs: '1rem', md: '1.05rem' } }}
          >
            Caleb
          </Typography>
        </Box>

        {/* 脉冲标志：点击进伙伴状态 */}
        <Tooltip title="伙伴状态">
          <IconButton
            onClick={openCompanion}
            sx={{ p: 1, mr: 0.5, '&:hover': { bgcolor: t.subtle } }}
            aria-label="伙伴状态"
          >
            <Box sx={{ position: 'relative', width: 14, height: 14 }}>
              {/* 外圈脉冲环 */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  animation: 'pulse-ring 2s ease-out infinite',
                }}
              />
              {/* 内圈实心点 */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 2,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  boxShadow: '0 0 6px rgba(34,197,94,0.8)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
            </Box>
          </IconButton>
        </Tooltip>

        {/* 齿轮按钮：工具箱 */}
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

        {/* 工具箱浮层（齿轮和脉冲共用） */}
        <Popover
          open={Boolean(toolboxEl)}
          anchorEl={toolboxEl}
          onClose={closeToolbox}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              bgcolor: 'transparent',
              boxShadow: 'none',
              mt: { xs: 0, sm: 1 },
              width: { xs: '100vw', sm: 'auto' },
              maxHeight: { xs: '100vh', sm: '82vh' },
              display: 'flex',
            },
          }}
          sx={{
            '& .MuiPopover-paper': { right: { xs: 0, sm: 'auto' } },
          }}
        >
          <Toolbox
            open={Boolean(toolboxEl)}
            anchorEl={toolboxEl}
            onClose={closeToolbox}
            initialTool={initialTool}
          />
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
