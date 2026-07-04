import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';

/**
 * AI 消息工具条：hover 消息时浮出，提供复制全文 + 重新生成
 */
export default function MessageActions({ message }) {
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

  // 重新生成由父级通过自定义事件触发，MessageList 监听
  // 这里只发事件，避免工具条依赖 chatStore（保持组件纯）
  const handleRegenerate = () => {
    window.dispatchEvent(
      new CustomEvent('message:regenerate', { detail: { id: message.id } })
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
        // 父级 MessageItem hover 时显示
        '.message-fade-in:hover &': { opacity: 1 },
      }}
    >
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
    </Box>
  );
}
