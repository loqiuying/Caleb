import { useState, useRef } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import { useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';

// 底部输入区：颜色走 token，聚焦时浮起
// Enter 发送，Shift+Enter 换行
export default function MessageInput({ onSend, disabled }) {
  const theme = useTheme();
  const t = theme.palette._;
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

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
        bgcolor: t.surface,
        borderTop: `1px solid ${t.border}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 820,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1.5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flexGrow: 1,
            borderRadius: 3,
            bgcolor: t.subtle,
            border: `1px solid ${t.border}`,
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:focus-within': {
              borderColor: t.accent,
              boxShadow: `0 0 0 3px ${t.accentSoft}`,
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
                borderRadius: 3,
                border: 'none',
                py: 0.75,
                px: 1.75,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: t.text,
                bgcolor: 'transparent',
                '& fieldset': { border: 'none' },
                '&.Mui-disabled': {
                  bgcolor: 'transparent',
                  color: t.muted,
                  WebkitTextFillColor: t.muted,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: t.muted,
                opacity: 0.7,
              },
            }}
          />
        </Paper>

        {/* 发送按钮：强调色圆形 */}
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          aria-label="发送"
          sx={{
            bgcolor: t.accent,
            color: '#ffffff',
            width: { xs: 40, sm: 44 },
            height: { xs: 40, sm: 44 },
            borderRadius: '50%',
            transition: 'all 0.2s',
            boxShadow: canSend ? `0 4px 16px ${t.accentSoft}` : 'none',
            '&:hover': {
              bgcolor: t.accentHover,
              transform: 'scale(1.06)',
            },
            '&:active': { transform: 'scale(0.94)' },
            '&.Mui-disabled': {
              bgcolor: t.border,
              color: t.muted,
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
