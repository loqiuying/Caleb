import { Box, Typography, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useSessionStore } from '../../store/sessionStore.js';

// 空状态占位：没有选中会话时显示欢迎信息
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
      }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: 3,
        }}
      >
        <ChatIcon sx={{ fontSize: 48, color: 'common.white' }} />
      </Box>

      <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
        欢迎使用 AI 聊天助手
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420 }}>
        智能对话助手，支持 Markdown 排版、代码高亮与流式回复。
        请在左侧选择会话，或创建新会话开始对话。
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleStart}
        sx={{ borderRadius: 8, px: 4 }}
      >
        开始新对话
      </Button>
    </Box>
  );
}
