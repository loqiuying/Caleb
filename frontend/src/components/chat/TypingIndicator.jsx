import { Box } from '@mui/material';
import { useTheme } from '@mui/material';

// "思考中"动画：三个跳动圆点，颜色走 token
export default function TypingIndicator() {
  const theme = useTheme();
  const t = theme.palette._;

  return (
    <Box
      className="message-fade-in"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        width: '100%',
      }}
    >
      {/* AI 头像 */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: 0.5,
          boxShadow: `0 2px 10px ${t.accentSoft}`,
        }}
      >
        AI
      </Box>

      {/* 三个跳动圆点（无气泡，直接在背景上） */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.8,
          px: 2,
          py: 1.75,
          borderRadius: 2.5,
          bgcolor: t.subtle,
          border: `1px solid ${t.border}`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: t.muted,
              animation: 'typing-bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
