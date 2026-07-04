import { useEffect } from 'react';
import {
  Box,
  List,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useSessionStore } from '../../store/sessionStore.js';
import SessionItem from './SessionItem.jsx';

// 侧边栏：会话列表，颜色走 token
export default function Sidebar({ onSelect }) {
  const theme = useTheme();
  const t = theme.palette._;
  const {
    sessions,
    currentSessionId,
    loading,
    loadSessions,
    createSession,
    selectSession,
    deleteSession,
  } = useSessionStore();

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleCreate = async () => {
    try {
      await createSession('新对话');
      onSelect?.();
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };

  const handleSelect = (id) => {
    selectSession(id);
    onSelect?.();
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    if (window.confirm('确定要删除这个会话吗？')) {
      try {
        await deleteSession(id);
      } catch (error) {
        console.error('删除会话失败:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: t.surface,
        color: t.text,
      }}
    >
      {/* 顶部标题 */}
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
            px: 1,
            color: t.text,
            fontSize: '1.05rem',
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: t.accent,
              boxShadow: `0 0 8px ${t.accent}`,
            }}
          />
          Caleb
        </Typography>
        {/* 新建会话按钮 */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            borderRadius: 2.5,
            py: 1.2,
            pl: 2,
            justifyContent: 'flex-start',
            bgcolor: t.accent,
            color: '#ffffff',
            fontWeight: 600,
            boxShadow: `0 2px 12px ${t.accentSoft}`,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: t.accentHover,
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 16px ${t.accentSoft}`,
            },
            '&:active': { transform: 'translateY(0) scale(0.99)' },
          }}
        >
          新建会话
        </Button>
      </Box>

      <Divider sx={{ borderColor: t.border }} />

      {/* 会话列表 */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 1 }}>
        {loading && sessions.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} sx={{ color: t.accent }} />
          </Box>
        ) : sessions.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 3, color: t.muted }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 40, opacity: 0.4, mb: 1 }} />
            <Typography variant="body2">暂无会话</Typography>
            <Typography variant="caption" sx={{ color: t.muted, opacity: 0.7 }}>
              点击上方按钮开始对话
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                selected={session.id === currentSessionId}
                onSelect={() => handleSelect(session.id)}
                onDelete={(e) => handleDelete(session.id, e)}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
