import { useState, useEffect } from 'react';
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
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import PaletteIcon from '@mui/icons-material/Palette';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupIcon from '@mui/icons-material/Group';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PlaceIcon from '@mui/icons-material/Place';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CheckIcon from '@mui/icons-material/Check';
import { useColorMode, useFont, useAccent } from '../../App.jsx';
import { ACCENTS } from '../../theme/theme.js';
import MemoryPool from '../memory/MemoryPool.jsx';
import CompanionStatus from '../companion/CompanionStatus.jsx';
import AddressEditor from '../companion/AddressEditor.jsx';
import WeatherPanel from '../weather/WeatherPanel.jsx';
import Album from '../album/Album.jsx';
import Diary from '../diary/Diary.jsx';
import Calendar from '../calendar/Calendar.jsx';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SortableToolList from './SortableToolList.jsx';
import { useToolOrderStore } from '../../store/toolOrderStore.js';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// 工具箱浮层：齿轮按钮触发，8 大入口（美化置顶）
// initialTool: 外部传入初始打开的工具 id（如脉冲按钮传 'companion'）
export default function Toolbox({ open, anchorEl, onClose, initialTool }) {
  const theme = useTheme();
  const t = theme.palette._;
  const { mode, toggle } = useColorMode();
  const { font, setFont, fonts } = useFont();
  const { accent, setAccent, accents } = useAccent();
  const [activeTool, setActiveTool] = useState(null);
  const { order, setOrder, resetOrder } = useToolOrderStore();

  // open 变 true 时，如果有 initialTool 直接进入对应面板
  useEffect(() => {
    if (open && initialTool) setActiveTool(initialTool);
    if (!open) setActiveTool(null); // 关闭时重置
  }, [open, initialTool]);

  // 功能入口（默认顺序，companion 由脉冲按钮进入不在此列）
  const defaultTools = [
    { id: 'beautify', name: '美化', icon: <PaletteIcon />, desc: '主题、字体与配色' },
    { id: 'address', name: '地址', icon: <PlaceIcon />, desc: '设置你和 Caleb 的位置' },
    { id: 'weather', name: '天气', icon: <WbSunnyIcon />, desc: '查看今日天气' },
    { id: 'diary', name: '日记', icon: <EditNoteIcon />, desc: '我们的日记' },
    { id: 'album', name: '相册', icon: <PhotoLibraryIcon />, desc: '收藏每一张照片' },
    { id: 'memory', name: '记忆池', icon: <PsychologyIcon />, desc: '共同记忆收藏' },
    { id: 'games', name: '小游戏', icon: <SportsEsportsIcon />, desc: '一起来玩个小游戏' },
    { id: 'study', name: '一起学习', icon: <SchoolIcon />, desc: '学习计划与打卡' },
    { id: 'calendar', name: '日历', icon: <CalendarMonthIcon />, desc: '记下每一天' },
    { id: 'interact', name: '一起互动', icon: <GroupIcon />, desc: '实时互动玩法' },
  ];

  // 按用户存储的顺序重排，缺失的入口补到末尾（兼容新增入口）
  const tools = order
    ? [
        ...order.map((id) => defaultTools.find((t) => t.id === id)).filter(Boolean),
        ...defaultTools.filter((t) => !order.includes(t.id)),
      ]
    : defaultTools;

  const activeToolObj = tools.find((x) => x.id === activeTool);

  // 标题映射：companion 不在 tools 里，单独处理
  const titleMap = { companion: 'Caleb的状态', address: '地址' };
  const panelTitle = activeToolObj ? activeToolObj.name : (titleMap[activeTool] || '工具箱');

  // 面板内容区是否需要更宽
  const widePanel = ['memory', 'companion', 'address', 'weather', 'album', 'diary', 'calendar'].includes(activeTool);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: t.surface,
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
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
          {panelTitle}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* 面板模式下显示返回箭头（直接关闭 Drawer 回聊天） */}
          {activeTool && (
            <IconButton
              size="small"
              onClick={onClose}
              title="返回聊天"
              sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          {/* 列表模式下显示"重置顺序"按钮 */}
          {!activeTool && order && (
            <IconButton
              size="small"
              onClick={() => resetOrder()}
              title="重置为默认顺序"
              sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}
            >
              <RestartAltIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => (activeTool ? setActiveTool(null) : onClose())}
            sx={{ color: t.muted, '&:hover': { color: t.text, bgcolor: t.subtle } }}
          >
            {activeTool ? <SettingsIcon sx={{ fontSize: 18 }} /> : <CloseIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* 内容区 */}
      {!activeTool ? (
        // 默认：可拖拽排序的入口列表
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <SortableToolList
            tools={tools}
            onReorder={setOrder}
            onSelect={setActiveTool}
          />
        </Box>
      ) : activeTool === 'beautify' ? (
        // 美化面板
        <Box sx={{ overflowY: 'auto', flex: 1, px: 2, py: 2 }}>
          {/* 外观模式：浅色/深色 */}
          <SectionLabel>外观模式</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
            <ModeCard
              active={mode === 'light'}
              onClick={() => mode !== 'light' && toggle()}
              icon={<LightModeIcon />}
              label="浅色"
              bg="#EDEDED"
              fg="#1A1A1A"
              t={t}
            />
            <ModeCard
              active={mode === 'dark'}
              onClick={() => mode !== 'dark' && toggle()}
              icon={<DarkModeIcon />}
              label="深色"
              bg="#111111"
              fg="#E6E6E6"
              t={t}
            />
          </Box>

          <Divider sx={{ borderColor: t.border, mb: 2 }} />

          {/* 强调色 */}
          <SectionLabel>强调色</SectionLabel>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            {accents.map((a) => {
              const c = ACCENTS[a.id][mode];
              const isActive = accent === a.id;
              return (
                <Box
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: c.accent,
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isActive ? `3px solid ${t.text}` : `3px solid transparent`,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                  title={a.name}
                >
                  {isActive && <CheckIcon sx={{ color: '#ffffff', fontSize: 20 }} />}
                </Box>
              );
            })}
          </Box>
          <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 2 }}>
            当前：{ACCENTS[accent].name}
          </Typography>

          <Divider sx={{ borderColor: t.border, mb: 2 }} />

          {/* 字体 */}
          <SectionLabel>字体</SectionLabel>
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
                py: 0.9,
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
              <ToggleButton
                key={f.id}
                value={f.id}
                sx={{
                  fontFamily:
                    f.id === 'system' ? 'var(--font-app)' :
                    f.id === 'noto-sans' ? '"Noto Sans SC", sans-serif' :
                    f.id === 'noto-serif' ? '"Noto Serif SC", serif' :
                    f.id === 'lxgw' ? '"LXGW WenKai TC", sans-serif' :
                    f.id === 'zcool' ? '"ZCOOL KuaiLe", sans-serif' :
                    f.id === 'mono' ? '"JetBrains Mono", monospace' :
                    'var(--font-app)',
                }}
              >
                {f.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Typography sx={{ fontSize: '0.72rem', color: t.muted, mt: 1.5, lineHeight: 1.6, fontFamily: 'var(--font-app)' }}>
            永和九年，岁在癸丑，暮春之初。<br />
            The quick brown fox jumps.
          </Typography>
        </Box>
      ) : activeTool === 'memory' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <MemoryPool />
        </Box>
      ) : activeTool === 'companion' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <CompanionStatus onClose={onClose} />
        </Box>
      ) : activeTool === 'address' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <AddressEditor />
        </Box>
      ) : activeTool === 'weather' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <WeatherPanel />
        </Box>
      ) : activeTool === 'album' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Album />
        </Box>
      ) : activeTool === 'diary' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Diary />
        </Box>
      ) : activeTool === 'calendar' ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Calendar />
        </Box>
      ) : (
        // 其他入口：占位
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
            {activeToolObj?.icon}
          </Box>
          <Typography sx={{ fontWeight: 600, color: t.text, mb: 0.5 }}>
            {activeToolObj?.name}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: t.muted }}>
            功能开发中，敬请期待
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// 分区标签
function SectionLabel({ children }) {
  const theme = useTheme();
  const t = theme.palette._;
  return (
    <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 1.25, letterSpacing: 1, fontWeight: 600 }}>
      {children}
    </Typography>
  );
}

// 外观模式卡片
function ModeCard({ active, onClick, icon, label, bg, fg, t }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: 2,
        border: `2px solid ${active ? t.accent : t.border}`,
        p: 1.5,
        cursor: 'pointer',
        bgcolor: bg,
        transition: 'all 0.2s',
        position: 'relative',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, color: fg }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: '0.78rem', color: fg, textAlign: 'center', fontWeight: 500 }}>
        {label}
      </Typography>
      {active && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: t.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckIcon sx={{ color: '#ffffff', fontSize: 12 }} />
        </Box>
      )}
    </Box>
  );
}
