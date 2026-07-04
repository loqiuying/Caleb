import { useState, useRef } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';

// 输入区域
export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // 发送消息
  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // 保持焦点
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 键盘事件：Enter 发送，Shift+Enter 换行
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
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
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&:focus-within': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 2px rgba(25,118,210,0.12)',
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
                borderRadius: 2,
                border: 'none',
                py: 0.5,
                px: 1.5,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                '& fieldset': { border: 'none' },
                '&.Mui-disabled': { bgcolor: 'transparent' },
              },
            }}
          />
        </Paper>

        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="发送"
          sx={{
            bgcolor: 'primary.main',
            color: 'common.white',
            width: 48,
            height: 48,
            borderRadius: 2,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          {disabled ? <StopIcon /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
