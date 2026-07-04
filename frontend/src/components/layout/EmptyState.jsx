import { Box, Typography, Button, Card } from '@mui/material';
import { useTheme } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CodeIcon from '@mui/icons-material/Code';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';
import { useSessionStore } from '../../store/sessionStore.js';

// 空状态：欢迎信息 + 建议卡片（降低冷启动门槛）
export default function EmptyState() {
  const theme = useTheme();
  const t = theme.palette._;
  const createSession = useSessionStore((s) => s.createSession);

  const handleStart = async () => {
    try {
      await createSession('新对话');
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };

  const suggestions = [
    { icon: <EmailIcon />, title: '帮我写一封邮件', desc: '正式商务风格' },
    { icon: <CodeIcon />, title: '解释这段代码', desc: '逐行注释' },
    { icon: <LightbulbIcon />, title: '头脑风暴点子', desc: '产品命名灵感' },
    { icon: <MenuBookIcon />, title: '总结一篇文章', desc: '提炼核心要点' },
  ];

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
        bgcolor: t.bg,
        color: t.text,
        overflowY: 'auto',
      }}
    >
      {/* Logo：渐变圆角方形 */}
      <Box
        sx={{
          width: 76,
          height: 76,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: `0 8px 32px ${t.accentSoft}`,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 38, color: '#ffffff' }} />
      </Box>

      <Typography
        variant="h5"
        sx={{ mb: 1, fontWeight: 700, color: t.text, letterSpacing: 1 }}
      >
        Caleb
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          maxWidth: 440,
          color: t.muted,
          lineHeight: 1.7,
        }}
      >
        智能对话助手，支持 Markdown 排版、代码高亮与流式回复。
        请在左侧选择会话，或创建新会话开始对话。
      </Typography>

      {/* 建议卡片：降低"不知道问什么"的冷启动门槛 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 1.5,
          width: '100%',
          maxWidth: 560,
          mb: 4,
        }}
      >
        {suggestions.map((s) => (
          <Card
            key={s.title}
            onClick={handleStart}
            elevation={0}
            sx={{
              p: 2.5,
              textAlign: 'left',
              cursor: 'pointer',
              bgcolor: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 3,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: t.accent,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${t.accentSoft}`,
              },
              '&:active': { transform: 'translateY(0)' },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: t.accentSoft,
                color: t.accent,
                mb: 1.5,
              }}
            >
              {s.icon}
            </Box>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: t.text }}>
              {s.title}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: t.muted, mt: 0.25 }}>
              {s.desc}
            </Typography>
          </Card>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleStart}
        sx={{
          borderRadius: 2.5,
          px: 4,
          py: 1.2,
          bgcolor: t.accent,
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: `0 4px 20px ${t.accentSoft}`,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: t.accentHover,
            transform: 'translateY(-1px)',
            boxShadow: `0 6px 24px ${t.accentSoft}`,
          },
          '&:active': { transform: 'translateY(0) scale(0.99)' },
        }}
      >
        开始新对话
      </Button>
    </Box>
  );
}
