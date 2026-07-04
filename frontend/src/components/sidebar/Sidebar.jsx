import { useEffect } from 'react';
import {
  Box,
  List,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useSessionStore } from '../../store/sessionStore.js';
import SessionItem from './SessionItem.jsx';

// 侧边栏：会话列表
export default function Sidebar({ onSelect }) {
  const {
    sessions,
    currentSessionId,
    loading,
    loadSessions,
    createSession,
    selectSession,
    deleteSession,
  } = useSessionStore();

  // 初始化加载会话列表
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 新建会话
  const handleCreate = async () => {
    try {
      await createSession('新对话');
      onSelect?.();
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };

  // 选中会话
  const handleSelect = (id) => {
    selectSession(id);
    onSelect?.();
  };

  // 删除会话
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
        bgcolor: 'background.paper',
      }}
    >
      {/* 顶部标题 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, px: 1 }}>
          AI 聊天助手
        </Typography>
        {/* 新建会话按钮 */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            borderRadius: 2,
            py: 1.2,
            justifyContent: 'flex-start',
            pl: 2,
          }}
        >
          新建会话
        </Button>
      </Box>

      <Divider />

      {/* 会话列表 */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 1 }}>
        {loading && sessions.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : sessions.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 40, opacity: 0.4, mb: 1 }} />
            <Typography variant="body2">暂无会话</Typography>
            <Typography variant="caption" color="text.disabled">
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
