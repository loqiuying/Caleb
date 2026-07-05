import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material';

// 空状态：会话初始化中的占位
export default function EmptyState({ loading }) {
  const theme = useTheme();
  const t = theme.palette._;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: t.bg,
        color: t.text,
        gap: 2,
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={28} sx={{ color: t.accent }} />
          <Typography sx={{ fontSize: '0.85rem', color: t.muted }}>
            正在连接 Caleb...
          </Typography>
        </>
      ) : (
        <Typography sx={{ fontSize: '0.85rem', color: t.muted, opacity: 0.7 }}>
          开始和 Caleb 对话吧
        </Typography>
      )}
    </Box>
  );
}
