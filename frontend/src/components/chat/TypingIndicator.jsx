import { Box } from '@mui/material';
import { useTheme } from '@mui/material';

// "思考中"动画：三个跳动圆点（无头像）
export default function TypingIndicator() {
  const theme = useTheme();
  const t = theme.palette._;

  return (
    <Box
      className="message-fade-in"
      sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.8,
          px: 2,
          py: 1.75,
          borderRadius: 2,
          borderTopLeftRadius: 0.5,
          bgcolor: t.bubbleAi,
          border: `1px solid ${t.bubbleAiBorder}`,
          boxShadow: theme.palette.mode === 'light'
            ? '0 1px 2px rgba(0,0,0,0.08)'
            : '0 1px 2px rgba(0,0,0,0.3)',
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
