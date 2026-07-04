import { Box } from '@mui/material';

// "思考中"动画：三个跳动的圆点（深色风格）
export default function TypingIndicator() {
  return (
    <Box
      className="message-fade-in"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
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
          background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(79,195,247,0.3)',
        }}
      >
        AI
      </Box>

      {/* 三个跳动圆点（深灰气泡） */}
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.8,
          px: 2,
          py: 1.75,
          borderRadius: 2,
          bgcolor: '#2A2A35',
          borderTopLeftRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 12,
            left: -6,
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '6px solid #2A2A35',
          },
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#4FC3F7',
              animation: 'typing-bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
