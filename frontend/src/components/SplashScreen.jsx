import { Box, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// 开屏加载页（Splash Screen）
// 全屏深色背景，居中显示 Logo 与加载进度条，2 秒后淡出
export default function SplashScreen() {
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
        bgcolor: '#0a0a0f',
        // 2 秒后淡出（由父组件卸载，CSS 控制视觉过渡）
        animation: 'splash-fade-out 0.5s ease-in 2s forwards',
      }}
    >
      {/* Logo：80px 圆形，浅蓝色渐变 */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          animation: 'logo-pulse 2s ease-in-out infinite',
        }}
      >
        <SmartToyIcon sx={{ color: '#ffffff', fontSize: 40 }} />
      </Box>

      {/* 应用名 */}
      <Typography
        sx={{
          color: '#ffffff',
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 2,
          mb: 4,
        }}
      >
        AI 助手
      </Typography>

      {/* 加载进度条：200px 宽，3px 高，圆角 */}
      <Box
        sx={{
          width: 200,
          height: 3,
          borderRadius: 3,
          bgcolor: '#1a1a24',
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
            background: 'linear-gradient(90deg, #4FC3F7 0%, #29B6F6 100%)',
            animation: 'splash-loading 2s ease-in-out forwards',
          }}
        />
      </Box>
    </Box>
  );
}
