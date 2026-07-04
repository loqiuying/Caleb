import {
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// 单个会话条目（深色风格）
export default function SessionItem({ session, selected, onSelect, onDelete }) {
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
        bgcolor: selected ? 'rgba(79,195,247,0.15)' : 'transparent',
        '&.Mui-selected': {
          bgcolor: 'rgba(79,195,247,0.18)',
          '&:hover': { bgcolor: 'rgba(79,195,247,0.22)' },
        },
        '&:hover': {
          bgcolor: selected ? 'rgba(79,195,247,0.22)' : 'rgba(255,255,255,0.04)',
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
              bgcolor: '#4FC3F7',
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
              color: selected ? '#4FC3F7' : '#ffffff',
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
              color: selected ? 'rgba(79,195,247,0.7)' : '#888899',
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
          bgcolor: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
        }}
      >
        <IconButton
          size="small"
          onClick={onDelete}
          aria-label="删除会话"
          sx={{
            color: selected ? '#4FC3F7' : '#888899',
            '&:hover': {
              color: '#ef5350',
              bgcolor: 'rgba(239,83,80,0.15)',
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

  // 今天
  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }
  // 昨天
  if (diff < 2 * oneDay) {
    return '昨天';
  }
  // 7 天内
  if (diff < 7 * oneDay) {
    return `${Math.floor(diff / oneDay)} 天前`;
  }
  // 其他
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
