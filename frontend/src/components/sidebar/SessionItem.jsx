import { useState, useRef, useEffect } from 'react';
import {
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  ListItemIcon,
} from '@mui/material';
import { useTheme } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useSessionStore } from '../../store/sessionStore.js';

// 单个会话条目：hover 显示 ⋯ 菜单（重命名 / 删除），支持 inline 编辑
export default function SessionItem({ session, selected, onSelect, onDelete }) {
  const theme = useTheme();
  const t = theme.palette._;
  const renameSession = useSessionStore((s) => s.renameSession);

  const [menuEl, setMenuEl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(session.title || '新对话');
  const inputRef = useRef(null);

  // 进入编辑模式时聚焦 + 选中文本
  useEffect(() => {
    if (editing) {
      setTimeout(() => {
        const el = inputRef.current?.querySelector('input');
        if (el) { el.focus(); el.select(); }
      }, 0);
    }
  }, [editing]);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  };
  const handleMenuClose = () => setMenuEl(null);

  const startRename = () => {
    setDraft(session.title || '新对话');
    setEditing(true);
    setMenuEl(null);
  };

  const commitRename = async () => {
    const trimmed = draft.trim();
    setEditing(false);
    if (!trimmed || trimmed === session.title) return;
    try {
      await renameSession(session.id, trimmed);
    } catch (error) {
      console.error('重命名失败:', error);
    }
  };

  const handleEditKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
    else if (e.key === 'Escape') { setEditing(false); }
  };

  // 编辑态：显示输入框
  if (editing) {
    return (
      <Box
        sx={{
          borderRadius: 2,
          mb: 0.5,
          px: 1.5,
          py: 1,
          bgcolor: t.subtle,
        }}
      >
        <TextField
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleEditKey}
          onBlur={commitRename}
          size="small"
          fullWidth
          variant="standard"
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.9rem',
              color: t.text,
              padding: '2px 0',
            },
          }}
          InputProps={{ disableUnderline: false }}
        />
      </Box>
    );
  }

  // 正常态
  return (
    <ListItemButton
      onClick={onSelect}
      selected={selected}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        px: 1.5,
        py: 1,
        position: 'relative',
        '&:hover .more-btn': { opacity: 1 },
        bgcolor: selected ? t.accentSoft : 'transparent',
        transition: 'background-color 0.15s',
        '&.Mui-selected': {
          bgcolor: t.accentSoft,
          '&:hover': { bgcolor: t.accentSoft },
        },
        '&:hover': {
          bgcolor: selected ? t.accentSoft : t.subtle,
        },
        '&::before': selected
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 8,
              bottom: 8,
              width: 3,
              borderRadius: 2,
              bgcolor: t.accent,
            }
          : {},
      }}
    >
      <ListItemText
        primary={
          <Typography
            noWrap
            sx={{
              fontWeight: selected ? 600 : 400,
              color: selected ? t.accent : t.text,
              fontSize: '0.9rem',
              pr: 3,
            }}
          >
            {session.title || '新对话'}
          </Typography>
        }
        secondary={
          <Typography
            noWrap
            variant="caption"
            sx={{
              color: selected ? t.accent : t.muted,
              opacity: selected ? 0.8 : 1,
              display: 'block',
              fontSize: '0.72rem',
            }}
          >
            {formatTime(session.updated_at || session.updatedAt || session.created_at)}
          </Typography>
        }
      />

      {/* ⋯ 菜单按钮：hover 时显示 */}
      <Box
        className="more-btn"
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          aria-label="更多操作"
          sx={{
            color: t.muted,
            p: 0.5,
            '&:hover': { color: t.text, bgcolor: t.border },
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 操作菜单 */}
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            bgcolor: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 140,
            '& .MuiMenuItem-root': {
              fontSize: '0.85rem',
              color: t.text,
              px: 1.5,
              py: 1,
            },
          },
        }}
      >
        <MenuItem onClick={startRename}>
          <ListItemIcon sx={{ minWidth: 32, color: t.muted }}>
            <EditIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          重命名
        </MenuItem>
        <MenuItem
          onClick={(e) => { handleMenuClose(); onDelete(e); }}
          sx={{ color: '#FA5151 !important' }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: '#FA5151' }}>
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          删除
        </MenuItem>
      </Menu>
    </ListItemButton>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;
  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes().toString().padStart(2, '0')}`;
  }
  if (diff < 2 * oneDay) return '昨天';
  if (diff < 7 * oneDay) return `${Math.floor(diff / oneDay)} 天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
