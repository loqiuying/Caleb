import { useState } from 'react';
import { Box, IconButton, Tooltip, Popover, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

/**
 * 消息工具条：hover 消息时浮出
 * - AI 消息：复制全文 + 重新生成
 * - 用户消息：编辑重发（弹出编辑框，改完确认重新发送）
 */
export default function MessageActions({ message, isUser }) {
  const theme = useTheme();
  const t = theme.palette._;
  const [copied, setCopied] = useState(false);
  const [editEl, setEditEl] = useState(null);
  const [draft, setDraft] = useState(message.content || '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('复制失败:', e);
    }
  };

  const handleRegenerate = () => {
    window.dispatchEvent(
      new CustomEvent('message:regenerate', { detail: { id: message.id } })
    );
  };

  // 打开编辑框
  const openEdit = (e) => {
    setDraft(message.content || '');
    setEditEl(e.currentTarget);
  };

  // 确认编辑重发
  const confirmEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setEditEl(null);
    window.dispatchEvent(
      new CustomEvent('message:resend', {
        detail: { id: message.id, content: trimmed },
      })
    );
  };

  return (
    <>
      <Box
        className="msg-actions"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 0.5,
          opacity: 0,
          transition: 'opacity 0.2s',
          '.message-fade-in:hover &': { opacity: 1 },
          justifyContent: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {isUser ? (
          // 用户消息：编辑重发
          <Tooltip title="编辑重发">
            <IconButton
              size="small"
              onClick={openEdit}
              sx={{
                color: t.muted,
                p: 0.5,
                '&:hover': { color: t.accent, bgcolor: t.subtle },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        ) : (
          // AI 消息：复制 + 重新生成
          <>
            <Tooltip title={copied ? '已复制' : '复制'}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  color: t.muted,
                  p: 0.5,
                  '&:hover': { color: t.accent, bgcolor: t.subtle },
                }}
              >
                {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="重新生成">
              <IconButton
                size="small"
                onClick={handleRegenerate}
                sx={{
                  color: t.muted,
                  p: 0.5,
                  '&:hover': { color: t.accent, bgcolor: t.subtle },
                }}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      {/* 编辑重发 Popover */}
      <Popover
        open={Boolean(editEl)}
        anchorEl={editEl}
        onClose={() => setEditEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: isUser ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: isUser ? 'right' : 'left' }}
        PaperProps={{
          sx: {
            bgcolor: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 2,
            boxShadow: 6,
            width: 320,
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box
            component="span"
            sx={{ fontSize: '0.78rem', color: t.muted, fontWeight: 600 }}
          >
            编辑后重发
          </Box>
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            multiline
            minRows={2}
            maxRows={6}
            autoFocus
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: t.subtle,
                color: t.text,
                fontSize: '0.88rem',
                '& fieldset': { borderColor: t.border },
                '&:hover fieldset': { borderColor: t.accent },
                '&.Mui-focused fieldset': { borderColor: t.accent },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              size="small"
              onClick={() => setEditEl(null)}
              sx={{ color: t.muted, textTransform: 'none' }}
            >
              取消
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={confirmEdit}
              disabled={!draft.trim()}
              sx={{
                bgcolor: t.accent,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: t.accentHover },
                '&.Mui-disabled': { bgcolor: t.border, color: t.muted },
              }}
            >
              重发
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
