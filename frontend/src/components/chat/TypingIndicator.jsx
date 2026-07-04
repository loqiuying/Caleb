import { Box, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// "思考中"动画：三个跳动的圆点
export default function TypingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        width: '100%',
      }}
    >
      {/* AI 头像 */}
      <Avatar
        sx={{
          bgcolor: 'secondary.main',
          width: 36,
          height: 36,
          flexShrink: 0,
        }}
      >
        <SmartToyIcon fontSize="small" />
      </Avatar>

      {/* 三个跳动圆点 */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.8,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: 'typing-bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
