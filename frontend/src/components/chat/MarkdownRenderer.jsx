import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, Link } from '@mui/material';

// Markdown 渲染器（深色主题适配）
// 支持 GFM（表格、列表、代码块等）与 highlight.js 代码高亮
export default function MarkdownRenderer({ content, isUser }) {
  // 用户消息不渲染 Markdown（保持纯文本 + 换行）
  if (isUser) {
    return (
      <Box
        component="div"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: '#ffffff',
        }}
      >
        {content}
      </Box>
    );
  }

  // AI 消息渲染 Markdown（深色主题）
  return (
    <Box
      className="markdown-body"
      sx={{
        color: '#E8E8EE',
        '& p': {
          margin: '0 0 8px 0',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          '&:last-child': { mb: 0 },
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          margin: '16px 0 8px 0',
          fontWeight: 600,
          lineHeight: 1.3,
          color: '#ffffff',
        },
        '& h1': { fontSize: '1.5rem' },
        '& h2': { fontSize: '1.3rem' },
        '& h3': { fontSize: '1.15rem' },
        '& h4': { fontSize: '1rem' },
        '& ul, & ol': {
          margin: '8px 0',
          paddingLeft: '1.5em',
        },
        '& li': {
          margin: '4px 0',
          fontSize: '0.95rem',
          lineHeight: 1.7,
        },
        '& blockquote': {
          margin: '8px 0',
          padding: '4px 12px',
          borderLeft: '3px solid #4FC3F7',
          bgcolor: 'rgba(79,195,247,0.08)',
          color: '#888899',
          '& p': { margin: 0, color: '#E8E8EE' },
        },
        '& code': {
          fontFamily:
            '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Courier New", monospace',
          fontSize: '0.85em',
        },
        // 行内代码
        '& :not(pre) > code': {
          padding: '2px 6px',
          borderRadius: 1,
          bgcolor: 'rgba(79,195,247,0.12)',
          color: '#4FC3F7',
        },
        // 代码块
        '& pre': {
          margin: '8px 0',
          padding: '12px 16px',
          borderRadius: 1.5,
          overflowX: 'auto',
          bgcolor: '#1e1e28',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          border: '1px solid #252530',
          '& code': {
            color: '#abb2bf',
            bgcolor: 'transparent',
            padding: 0,
          },
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          margin: '8px 0',
          fontSize: '0.9rem',
        },
        '& th, & td': {
          border: '1px solid #252530',
          padding: '6px 12px',
          textAlign: 'left',
        },
        '& th': {
          bgcolor: 'rgba(79,195,247,0.1)',
          fontWeight: 600,
          color: '#ffffff',
        },
        '& a': {
          color: '#4FC3F7',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline', color: '#29B6F6' },
        },
        '& hr': {
          border: 'none',
          borderTop: '1px solid #252530',
          margin: '12px 0',
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: 1,
        },
        // 强调/粗体/斜体颜色
        '& strong': { color: '#ffffff', fontWeight: 600 },
        '& em': { color: '#E8E8EE' },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 链接在新标签页打开
          a: ({ node, ...props }) => (
            <Link {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
