import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * 消息工具条：hover 消息时浮出
 * - AI 消息：复制全文 + 重新生成
 * - 用户消息：重发（基于该消息重新请求 AI）
 */
export default function MessageActions({ message, isUser }) {
  const theme = useTheme();
  const t = theme.palette._;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('复制失败:', e);
    }
  };

  // 重新生成（AI 消息）：基于上一条 user 消息重新请求
  const handleRegenerate = () => {
    window.dispatchEvent(
      new CustomEvent('message:regenerate', { detail: { id: message.id } })
    );
  };

  // 重发（用户消息）：从该 user 消息重新请求
  const handleResend = () => {
    window.dispatchEvent(
      new CustomEvent('message:resend', { detail: { id: message.id } })
    );
  };

  return (
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
        // 用户消息工具条靠右
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {isUser ? (
        // 用户消息：仅重发
        <Tooltip title="重发">
          <IconButton
            size="small"
            onClick={handleResend}
            sx={{
              color: t.muted,
              p: 0.5,
              '&:hover': { color: t.accent, bgcolor: t.subtle },
            }}
          >
            <ReplayIcon sx={{ fontSize: 16 }} />
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
  );
}
