import { useState, useRef } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';

// 微信风格底部输入区
// 深色背景，圆角深灰输入框，浅蓝圆形发送按钮
// Enter 发送，Shift+Enter 换行
export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // 发送消息
  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 键盘事件：Enter 发送，Shift+Enter 换行
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <Box
      sx={{
        p: { xs: 1.25, md: 1.75 },
        bgcolor: '#13131a',
        borderTop: '1px solid #252530',
      }}
    >
      <Box
        sx={{
          maxWidth: 820,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flexGrow: 1,
            borderRadius: 4,
            bgcolor: '#1E1E28',
            border: '1px solid #252530',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:focus-within': {
              borderColor: '#4FC3F7',
              boxShadow: '0 0 0 2px rgba(79,195,247,0.15)',
            },
            overflow: 'hidden',
          }}
        >
          <TextField
            inputRef={inputRef}
            multiline
            fullWidth
            minRows={1}
            maxRows={6}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                border: 'none',
                py: 0.75,
                px: 1.75,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: '#ffffff',
                bgcolor: 'transparent',
                '& fieldset': { border: 'none' },
                '&.Mui-disabled': {
                  bgcolor: 'transparent',
                  color: '#888899',
                  WebkitTextFillColor: '#888899',
                },
                '&::placeholder': {
                  color: '#5a5a6a',
                  opacity: 1,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#5a5a6a',
                opacity: 1,
              },
            }}
          />
        </Paper>

        {/* 发送按钮：浅蓝圆形 */}
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          aria-label="发送"
          sx={{
            bgcolor: '#4FC3F7',
            color: '#ffffff',
            width: 44,
            height: 44,
            borderRadius: '50%',
            transition: 'all 0.2s',
            boxShadow: canSend
              ? '0 4px 14px rgba(79,195,247,0.4)'
              : 'none',
            '&:hover': {
              bgcolor: '#29B6F6',
              transform: 'scale(1.05)',
            },
            '&.Mui-disabled': {
              bgcolor: '#252530',
              color: '#5a5a6a',
              boxShadow: 'none',
            },
          }}
        >
          {disabled ? <StopIcon /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
