import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// 开屏加载页：加载条上方显示 Caleb 字样，2 秒后淡出
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
      {/* Logo：圆角方形渐变 */}
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

      {/* Caleb 字样：大字号 + 大字距 + 渐变文字 */}
      <Typography
        sx={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: 6,
          mb: 1,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        CALEB
      </Typography>

      {/* 副标题 */}
      <Typography
        sx={{
          color: t.muted,
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: 2,
          mb: 4,
        }}
      >
        智能对话助手
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
