import { useState, useRef } from 'react';
import { Box, TextField, IconButton, Paper, Popover, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

const EMOJIS = [
  '😀','😁','😂','🤣','😊','😍','🥰','😘','🤔','😎',
  '😢','😭','😡','👍','👎','❤️','🔥','✨','🎉','😅',
  '😉','😋','😴','🥳','🤗','🫶','🙌','👏','🙏','💪',
  '🌹','🌸','🌟','☕','🍕','🎵','📚','🎁','💕','😘',
];

const BTN_SIZE = { xs: 40, sm: 44 };

// 底部输入区：颜色走 token，聚焦时浮起
// Enter 发送，Shift+Enter 换行
export default function MessageInput({ onSend, disabled }) {
  const theme = useTheme();
  const t = theme.palette._;
  const [value, setValue] = useState('');
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [tab, setTab] = useState(0);
  // 图片缓存：[图片] 占位对应的 base64 数据，先进先出
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    let content = trimmed;
    if (images.length > 0) {
      // 把 [图片] 占位替换为 [image:base64...]
      let imgIdx = 0;
      content = content.replace(/\[图片\]/g, () => {
        if (imgIdx < images.length) {
          const data = images[imgIdx++];
          return `[image:${data}]`;
        }
        return '';
      });
      // 末尾若还有未匹配占位的图片，追加到末尾
      while (imgIdx < images.length) {
        content += ` [image:${images[imgIdx]}]`;
        imgIdx++;
      }
    }
    onSend(content);
    setValue('');
    setImages([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (em) => {
    setValue((v) => v + em);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || '');
      setImages((arr) => [...arr, base64]);
      setValue((v) => v + (v && !v.endsWith(' ') ? ' ' : '') + '[图片]');
    };
    reader.readAsDataURL(file);
    // 重置 input 以便同一文件可重复选
    e.target.value = '';
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const canSend = !disabled && value.trim().length > 0;
  const emojiOpen = Boolean(emojiAnchor);

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

        {/* 表情按钮：与发送按钮同尺寸 */}
        <IconButton
          onClick={(e) => setEmojiAnchor(e.currentTarget)}
          aria-label="表情/图片"
          sx={{
            color: t.muted,
            width: BTN_SIZE,
            height: BTN_SIZE,
            borderRadius: '50%',
            transition: 'all 0.2s',
            '&:hover': {
              color: t.accent,
              bgcolor: t.accentSoft,
            },
          }}
        >
          <SentimentSatisfiedAltIcon />
        </IconButton>

        {/* 发送按钮：强调色圆形 */}
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          aria-label="发送"
          sx={{
            bgcolor: t.accent,
            color: '#ffffff',
            width: BTN_SIZE,
            height: BTN_SIZE,
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

      {/* 表情/图片 Popover */}
      <Popover
        open={emojiOpen}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: t.surface,
            border: `1px solid ${t.border}`,
            boxShadow: 3,
            width: { xs: 280, sm: 320 },
          },
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            borderBottom: `1px solid ${t.border}`,
            '& .MuiTab-root': {
              minHeight: 40,
              fontSize: '0.78rem',
              textTransform: 'none',
              color: t.muted,
              '&.Mui-selected': { color: t.accent },
            },
            '& .MuiTabs-indicator': { bgcolor: t.accent, height: 2 },
          }}
        >
          <Tab icon={<EmojiEmotionsOutlinedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="表情" />
          <Tab icon={<InsertPhotoOutlinedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="图片" />
        </Tabs>

        <Box sx={{ p: 1.5 }}>
          {tab === 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: 0.5,
                maxHeight: 220,
                overflowY: 'auto',
              }}
            >
              {EMOJIS.map((em) => (
                <Box
                  key={em}
                  onClick={() => insertEmoji(em)}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    p: 0.5,
                    borderRadius: 1,
                    transition: 'background 0.15s',
                    '&:hover': { bgcolor: t.accentSoft },
                  }}
                >
                  {em}
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Button
                variant="outlined"
                startIcon={<InsertPhotoOutlinedIcon />}
                onClick={() => fileRef.current?.click()}
                sx={{
                  color: t.accent,
                  borderColor: t.accent,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': { bgcolor: t.accentSoft, borderColor: t.accentHover },
                }}
              >
                选择图片
              </Button>
              <Typography sx={{ fontSize: '0.72rem', color: t.muted, mt: 1 }}>
                {images.length > 0 ? `已添加 ${images.length} 张图片（[图片] 占位）` : '选择后会以 [图片] 占位插入输入框'}
              </Typography>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
