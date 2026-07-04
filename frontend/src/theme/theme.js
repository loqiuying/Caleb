import { createTheme } from '@mui/material/styles';

/**
 * 主题配置：深浅色双套，语义化 token
 *
 * 颜色规范（深色）：
 *   背景：#0d1117（主）/ #161b22（表面）/ #1c2128（次级）
 *   文字：#e6edf3（主）/ #8b949e（次）
 *   强调：#818cf8（indigo，深色下提亮一档保证对比）
 *
 * 颜色规范（浅色）：
 *   背景：#fafafa（主）/ #ffffff（表面）/ #f4f4f5（次级）
 *   文字：#1f1f23（主）/ #71717a（次）
 *   强调：#6366f1（indigo）
 */

// 语义化 token：深浅色各一套
// 组件里通过 useTheme().palette.* 访问，不写死颜色值
export const tokens = {
  dark: {
    bg:          '#0d1117',  // 主背景（GitHub 风，比纯黑通透）
    surface:     '#161b22',  // 卡片/侧栏/顶栏表面
    subtle:      '#1c2128',  // 次级背景（hover、代码块外层）
    border:      '#262c36',  // 极淡边线
    text:        '#e6edf3',  // 主文字
    muted:       '#8b949e',  // 次要文字
    accent:      '#818cf8',  // 强调色（indigo-400，深色下提亮）
    accentHover: '#6366f1',  // 强调色 hover（indigo-500）
    accentSoft:  'rgba(129, 140, 248, 0.14)', // 强调色浅底
    codeBg:      '#11111b',  // 代码块底（catppuccin-mocha）
    codeText:    '#cdd6f4',
    bubbleUser:  'rgba(129, 140, 248, 0.16)', // 用户气泡：强调色软底
    bubbleUserText: '#c7d2fe',
  },
  light: {
    bg:          '#fafafa',
    surface:     '#ffffff',
    subtle:      '#f4f4f5',
    border:      '#ececec',
    text:        '#1f1f23',
    muted:       '#71717a',
    accent:      '#6366f1',  // indigo-500
    accentHover: '#4f46e5',  // indigo-600
    accentSoft:  '#eef2ff',  // indigo-50
    codeBg:      '#1e1e2e',  // 代码块统一深底
    codeText:    '#cdd6f4',
    bubbleUser:  '#eef2ff',
    bubbleUserText: '#4338ca',
  },
};

// 缓存已创建的 theme，避免重复 createTheme
const cache = { dark: null, light: null };

export function getTheme(mode = 'dark') {
  if (cache[mode]) return cache[mode];
  const t = tokens[mode];

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: t.accent,
        light: t.accent,
        dark: t.accentHover,
        contrastText: '#ffffff',
      },
      secondary: {
        main: t.accentHover,
        contrastText: '#ffffff',
      },
      background: {
        default: t.bg,
        paper: t.surface,
      },
      text: {
        primary: t.text,
        secondary: t.muted,
      },
      divider: t.border,
      error:   { main: '#ef4444' },
      success: { main: '#22c55e' },
      warning: { main: '#f59e0b' },
      info:    { main: t.accent },
    },
    shape: { borderRadius: 12 },
    // 柔和阴影体系：浅色用黑透明，深色用更深的黑
    shadows: mode === 'dark'
      ? [
          'none',
          '0 1px 2px rgba(0,0,0,0.4)',
          '0 1px 3px rgba(0,0,0,0.5)',
          '0 2px 6px rgba(0,0,0,0.5)',
          '0 4px 12px rgba(0,0,0,0.55)',
          '0 6px 16px rgba(0,0,0,0.6)',
          '0 8px 24px rgba(0,0,0,0.6)',
          '0 12px 32px rgba(0,0,0,0.65)',
          ...Array(17).fill('0 16px 40px rgba(0,0,0,0.7)'),
        ]
      : [
          'none',
          '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
          '0 1px 3px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.06)',
          '0 2px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.07)',
          '0 4px 12px rgba(0,0,0,0.07), 0 6px 16px rgba(0,0,0,0.08)',
          '0 6px 16px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.1)',
          '0 8px 24px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.12)',
          '0 12px 32px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.14)',
          ...Array(17).fill('0 16px 40px rgba(0,0,0,0.16)'),
        ],
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
      fontFamilyCode:
        '"JetBrains Mono", "Fira Code", ui-monospace, Consolas, Monaco, "Courier New", monospace',
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiListItemButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiAppBar: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.bg,
            // 全局过渡：主题切换时颜色平滑变化
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '*::-webkit-scrollbar': { width: 8, height: 8 },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            background: mode === 'dark'
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(0,0,0,0.12)',
            borderRadius: 8,
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: mode === 'dark'
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(0,0,0,0.22)',
          },
        },
      },
    },
  });

  // 把语义 token 挂到 palette 上，组件里用 theme.palette._.xxx 访问
  // 用下划线前缀避免和 MUI 内置 key 冲突
  theme.palette._ = t;
  cache[mode] = theme;
  return theme;
}

// 兼容旧引用（如有）
export const theme = getTheme('dark');
