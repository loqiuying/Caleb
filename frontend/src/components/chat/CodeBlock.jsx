import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

/**
 * 代码块三件套：语言标签 + 复制按钮 + 深底
 *
 * 由 MarkdownRenderer 的 pre 自定义渲染调用。
 * props.children 是 react-markdown 传来的 <code className="language-xxx">。
 */
export default function CodeBlock({ children }) {
  const theme = useTheme();
  const t = theme.palette._;
  const [copied, setCopied] = useState(false);

  // 从子节点 className 提取语言标识（react-markdown 会给 code 加 language-xxx）
  let lang = 'text';
  let codeContent = '';
  if (children?.props) {
    const cls = children.props.className || '';
    const match = /language-(\w+)/.exec(cls);
    if (match) lang = match[1];
    codeContent = String(children.props.children ?? '');
  } else if (typeof children === 'string') {
    codeContent = children;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent.replace(/\n$/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('复制失败:', e);
    }
  };

  return (
    <Box
      sx={{
        my: 1.5,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${t.border}`,
        bgcolor: t.codeBg,
      }}
    >
      {/* 顶栏：语言标签 + 复制按钮 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 0.75,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          bgcolor: 'rgba(255,255,255,0.03)',
        }}
      >
        <Box
          component="span"
          sx={{
            fontFamily: theme.typography.fontFamilyCode,
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'lowercase',
            letterSpacing: 0.5,
          }}
        >
          {lang}
        </Box>
        <IconButton
          onClick={handleCopy}
          size="small"
          aria-label="复制代码"
          sx={{
            color: copied ? '#22c55e' : 'rgba(255,255,255,0.55)',
            borderRadius: 1.5,
            px: 1,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              color: copied ? '#22c55e' : '#ffffff',
            },
          }}
        >
          {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.72rem', fontFamily: 'inherit' }}>
            {copied ? '已复制' : '复制'}
          </Box>
        </IconButton>
      </Box>

      {/* 代码体：保留 react-markdown + rehype-highlight 的语法高亮 */}
      <Box
        component="pre"
        sx={{
          margin: 0,
          p: 2,
          overflowX: 'auto',
          bgcolor: 'transparent',
          '& code': {
            fontFamily: theme.typography.fontFamilyCode,
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: t.codeText,
            bgcolor: 'transparent',
            padding: 0,
          },
          '& code.hljs': {
            background: 'transparent',
            padding: 0,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
