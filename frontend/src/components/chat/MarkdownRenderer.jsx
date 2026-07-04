import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, Link } from '@mui/material';
import { useTheme } from '@mui/material';
import CodeBlock from './CodeBlock.jsx';

/**
 * Markdown 渲染器：颜色走 token，代码块用 CodeBlock（语言标签+复制按钮+深底）
 * 用户消息不渲染 Markdown（纯文本 + 换行）
 */
export default function MarkdownRenderer({ content, isUser }) {
  const theme = useTheme();
  const t = theme.palette._;

  // 用户消息：纯文本
  if (isUser) {
    return (
      <Box
        component="div"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '0.95rem',
          lineHeight: 1.65,
          color: t.bubbleUserText,
        }}
      >
        {content}
      </Box>
    );
  }

  // AI 消息：渲染 Markdown
  return (
    <Box
      className="markdown-body"
      sx={{
        color: t.text,
        '& p': {
          margin: '0 0 10px 0',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          '&:last-child': { mb: 0 },
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          margin: '18px 0 8px 0',
          fontWeight: 600,
          lineHeight: 1.3,
          color: t.text,
        },
        '& h1': { fontSize: '1.4rem' },
        '& h2': { fontSize: '1.25rem' },
        '& h3': { fontSize: '1.1rem' },
        '& h4': { fontSize: '1rem' },
        '& ul, & ol': { margin: '8px 0', paddingLeft: '1.5em' },
        '& li': { margin: '4px 0', fontSize: '0.95rem', lineHeight: 1.7 },
        '& blockquote': {
          margin: '10px 0',
          padding: '6px 14px',
          borderLeft: `3px solid ${t.accent}`,
          bgcolor: t.subtle,
          color: t.muted,
          borderRadius: 1,
          '& p': { margin: 0, color: t.text },
        },
        '& code': {
          fontFamily: theme.typography.fontFamilyCode,
          fontSize: '0.85em',
        },
        // 行内代码
        '& :not(pre) > code': {
          padding: '2px 6px',
          borderRadius: 1,
          bgcolor: t.subtle,
          color: t.accent,
          border: `1px solid ${t.border}`,
        },
        // pre 由 CodeBlock 组件渲染（下方 components.pre）
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          margin: '10px 0',
          fontSize: '0.9rem',
          display: 'block',
          overflowX: 'auto',
        },
        '& th, & td': {
          border: `1px solid ${t.border}`,
          padding: '6px 12px',
          textAlign: 'left',
        },
        '& th': {
          bgcolor: t.subtle,
          fontWeight: 600,
          color: t.text,
        },
        '& a': {
          color: t.accent,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline', color: t.accentHover },
        },
        '& hr': {
          border: 'none',
          borderTop: `1px solid ${t.border}`,
          margin: '14px 0',
        },
        '& img': { maxWidth: '100%', borderRadius: 1 },
        '& strong': { color: t.text, fontWeight: 700 },
        '& em': { color: t.text },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 链接新标签页打开
          a: ({ node, ...props }) => (
            <Link {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // 代码块：包装成 CodeBlock（带语言标签 + 复制按钮）
          pre: ({ node, children, ...props }) => (
            <CodeBlock {...props}>{children}</CodeBlock>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
