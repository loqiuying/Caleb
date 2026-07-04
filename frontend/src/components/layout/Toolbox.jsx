import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupIcon from '@mui/icons-material/Group';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorMode, useFont } from '../../App.jsx';

// 工具箱浮层：齿轮按钮触发，含字体切换 + 主题切换 + 7 大功能入口
export default function Toolbox({ open, anchorEl, onClose }) {
  const theme = useTheme();
  const t = theme.palette._;
  const { mode, toggle } = useColorMode();
  const { font, setFont, fonts } = useFont();
  const [activeTool, setActiveTool] = useState(null);

  // 7 大功能入口
  const tools = [
    { id: 'companion', name: '伙伴状态', icon: <FavoriteIcon />, desc: '查看伙伴在线状态' },
    { id: 'games', name: '小游戏', icon: <SportsEsportsIcon />, desc: '一起来玩个小游戏' },
    { id: 'interact', name: '一起互动', icon: <GroupIcon />, desc: '实时互动玩法' },
    { id: 'weather', name: '天气', icon: <WbSunnyIcon />, desc: '查看今日天气' },
    { id: 'study', name: '一起学习', icon: <SchoolIcon />, desc: '学习计划与打卡' },
    { id: 'calendar', name: '日历记录本', icon: <CalendarMonthIcon />, desc: '记下每一天' },
    { id: 'memory', name: '记忆池', icon: <PsychologyIcon />, desc: '共同记忆收藏' },
  ];

  return (
    <Box
      sx={{
        width: 320,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: t.surface,
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${t.border}`,
        boxShadow: 6,
      }}
    >
      {/* 顶部标题栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: t.text }}>
          {activeTool ? tools.find((x) => x.id === activeTool)?.name : '工具箱'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* 主题切换 */}
          <IconButton
            size="small"
            onClick={toggle}
            sx={{ color: t.muted, '&:hover': { color: t.text, bgcolor: t.subtle } }}
          >
            {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          {/* 返回/关闭 */}
          <IconButton
            size="small"
            onClick={() => (activeTool ? setActiveTool(null) : onClose())}
            sx={{ color: t.muted, '&:hover': { color: t.text, bgcolor: t.subtle } }}
          >
            {activeTool ? <SettingsIcon sx={{ fontSize: 18 }} /> : <CloseIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* 内容区：默认列表 / 选中后占位 */}
      {!activeTool ? (
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {/* 字体切换区 */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 1, letterSpacing: 1 }}>
              字体
            </Typography>
            <ToggleButtonGroup
              value={font}
              exclusive
              onChange={(_, v) => v && setFont(v)}
              size="small"
              sx={{
                width: '100%',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  fontSize: '0.78rem',
                  py: 0.6,
                  color: t.muted,
                  borderColor: t.border,
                  '&.Mui-selected': {
                    bgcolor: t.accentSoft,
                    color: t.accent,
                    borderColor: t.accent,
                    '&:hover': { bgcolor: t.accentSoft },
                  },
                },
              }}
            >
              {fonts.map((f) => (
                <ToggleButton key={f.id} value={f.id} sx={{ fontFamily: f.id === 'system' ? 'var(--font-app)' : f.id === 'noto-sans' ? '"Noto Sans SC", sans-serif' : '"Noto Serif SC", serif' }}>
                  {f.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ borderColor: t.border }} />

          {/* 功能入口列表 */}
          <List sx={{ p: 0.5 }}>
            {tools.map((tool) => (
              <ListItemButton
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.25,
                  px: 1.5,
                  py: 1.25,
                  '&:hover': { bgcolor: t.subtle },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: t.accent,
                    '& svg': { fontSize: 22 },
                  }}
                >
                  {tool.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: t.text }}>
                      {tool.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: '0.72rem', color: t.muted }}>
                      {tool.desc}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ) : (
        // 选中工具后的占位内容
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: t.accentSoft,
              color: t.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              '& svg': { fontSize: 28 },
            }}
          >
            {tools.find((x) => x.id === activeTool)?.icon}
          </Box>
          <Typography sx={{ fontWeight: 600, color: t.text, mb: 0.5 }}>
            {tools.find((x) => x.id === activeTool)?.name}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: t.muted }}>
            功能开发中，敬请期待
          </Typography>
        </Box>
      )}
    </Box>
  );
}
