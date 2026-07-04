import {
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// 单个会话条目：颜色走 token
export default function SessionItem({ session, selected, onSelect, onDelete }) {
  const theme = useTheme();
  const t = theme.palette._;

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
        '&:hover .delete-btn': { opacity: 1 },
        bgcolor: selected ? t.accentSoft : 'transparent',
        transition: 'background-color 0.15s',
        '&.Mui-selected': {
          bgcolor: t.accentSoft,
          '&:hover': { bgcolor: t.accentSoft },
        },
        '&:hover': {
          bgcolor: selected ? t.accentSoft : t.subtle,
        },
        // 左侧选中条
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

      {/* 删除按钮：hover 时显示 */}
      <Box
        className="delete-btn"
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0,
          transition: 'opacity 0.2s',
          bgcolor: 'rgba(0,0,0,0.25)',
          borderRadius: '50%',
        }}
      >
        <IconButton
          size="small"
          onClick={onDelete}
          aria-label="删除会话"
          sx={{
            color: selected ? t.accent : t.muted,
            '&:hover': {
              color: '#ef4444',
              bgcolor: 'rgba(239,68,68,0.15)',
            },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItemButton>
  );
}

// 格式化时间显示
function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;

  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }
  if (diff < 2 * oneDay) return '昨天';
  if (diff < 7 * oneDay) return `${Math.floor(diff / oneDay)} 天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
