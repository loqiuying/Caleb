import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// 开屏加载页：2 秒后淡出，颜色走 token
export default function SplashScreen() {
  const theme = useTheme();
  const t = theme.palette._;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: t.bg,
        animation: 'splash-fade-out 0.5s ease-in 2s forwards',
      }}
    >
      {/* Logo：渐变圆角方形（比圆形更现代） */}
      <Box
        sx={{
          width: 84,
          height: 84,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          animation: 'logo-pulse 2s ease-in-out infinite',
        }}
      >
        <SmartToyIcon sx={{ color: '#ffffff', fontSize: 42 }} />
      </Box>

      <Typography
        sx={{
          color: t.text,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 2,
          mb: 4,
        }}
      >
        AI 助手
      </Typography>

      {/* 加载进度条 */}
      <Box
        sx={{
          width: 200,
          height: 3,
          borderRadius: 3,
          bgcolor: t.subtle,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
            animation: 'splash-loading 2s ease-in-out forwards',
          }}
        />
      </Box>
    </Box>
  );
}
