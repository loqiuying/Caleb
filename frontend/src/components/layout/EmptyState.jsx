import { Box, Typography, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useSessionStore } from '../../store/sessionStore.js';

// 空状态占位：没有选中会话时显示欢迎信息（深色风格）
export default function EmptyState() {
  const createSession = useSessionStore((s) => s.createSession);

  // 快速创建新会话
  const handleStart = async () => {
    try {
      await createSession('新对话');
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        bgcolor: '#0a0a0f',
        color: '#ffffff',
      }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: '0 0 40px rgba(79,195,247,0.35)',
        }}
      >
        <ChatIcon sx={{ fontSize: 48, color: '#ffffff' }} />
      </Box>

      <Typography
        variant="h5"
        sx={{ mb: 1, fontWeight: 600, color: '#ffffff' }}
      >
        欢迎使用 AI 助手
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          maxWidth: 420,
          color: '#888899',
          lineHeight: 1.7,
        }}
      >
        智能对话助手，支持 Markdown 排版、代码高亮与流式回复。
        请在左侧选择会话，或创建新会话开始对话。
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleStart}
        sx={{
          borderRadius: 8,
          px: 4,
          py: 1.2,
          bgcolor: '#4FC3F7',
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(79,195,247,0.35)',
          '&:hover': {
            bgcolor: '#29B6F6',
            boxShadow: '0 6px 20px rgba(79,195,247,0.5)',
          },
        }}
      >
        开始新对话
      </Button>
    </Box>
  );
}
