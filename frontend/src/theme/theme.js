import { createTheme } from '@mui/material/styles';

/**
 * 主题配置：微信/QQ 个人聊天风格 + 多强调色预设
 *
 * 浅色：聊天背景米色 #EDEDED，气泡白/绿
 * 深色：现代深色，气泡深灰/深绿
 * 强调色：4 个预设，用户可在"美化"入口切换
 */

// 强调色预设：每个含 main/hover/soft(深浅各一) + 气泡色
// id 用于持久化，name 用于显示
export const ACCENTS = {
  green: {
    id: 'green',
    name: '微信绿',
    light: { accent: '#07C160', accentHover: '#06AD56', accentSoft: '#E6F7EC', bubbleUser: '#95EC69', bubbleUserText: '#1A1A1A' },
    dark:  { accent: '#07C160', accentHover: '#06AD56', accentSoft: 'rgba(7,193,96,0.16)', bubbleUser: '#2E5A3E', bubbleUserText: '#E6E6E6' },
  },
  indigo: {
    id: 'indigo',
    name: '靛蓝',
    light: { accent: '#6366f1', accentHover: '#4f46e5', accentSoft: '#eef2ff', bubbleUser: '#e0e7ff', bubbleUserText: '#3730a3' },
    dark:  { accent: '#818cf8', accentHover: '#6366f1', accentSoft: 'rgba(129,140,248,0.16)', bubbleUser: '#3730a3', bubbleUserText: '#c7d2fe' },
  },
  rose: {
    id: 'rose',
    name: '玫瑰粉',
    light: { accent: '#f43f5e', accentHover: '#e11d48', accentSoft: '#ffe4e6', bubbleUser: '#ffe4e6', bubbleUserText: '#9f1239' },
    dark:  { accent: '#fb7185', accentHover: '#f43f5e', accentSoft: 'rgba(251,113,133,0.16)', bubbleUser: '#4c0519', bubbleUserText: '#fecdd3' },
  },
  sky: {
    id: 'sky',
    name: '天蓝',
    light: { accent: '#0ea5e9', accentHover: '#0284c7', accentSoft: '#e0f2fe', bubbleUser: '#bae6fd', bubbleUserText: '#075985' },
    dark:  { accent: '#38bdf8', accentHover: '#0ea5e9', accentSoft: 'rgba(56,189,248,0.16)', bubbleUser: '#0c4a6e', bubbleUserText: '#bae6fd' },
  },
};

// 基础 token（不含 accent 相关，accent 由预设注入）
const baseTokens = {
  light: {
    bg: '#EDEDED', surface: '#FFFFFF', subtle: '#F5F5F5', border: '#E5E5E5',
    text: '#1A1A1A', muted: '#888888',
    codeBg: '#1e1e2e', codeText: '#cdd6f4',
    bubbleAi: '#FFFFFF', bubbleAiText: '#1A1A1A', bubbleAiBorder: '#E5E5E5',
  },
  dark: {
    bg: '#111111', surface: '#1F1F1F', subtle: '#2A2A2A', border: '#2E2E2E',
    text: '#E6E6E6', muted: '#999999',
    codeBg: '#11111b', codeText: '#cdd6f4',
    bubbleAi: '#2A2A2A', bubbleAiText: '#E6E6E6', bubbleAiBorder: '#2E2E2E',
  },
};

// 兼容旧导出（固定 green）
export const tokens = {
  light: { ...baseTokens.light, ...ACCENTS.green.light },
  dark:  { ...baseTokens.dark,  ...ACCENTS.green.dark },
};

const cache = new Map();

export function getTheme(mode = 'dark', accentId = 'green') {
  const key = `${mode}-${accentId}`;
  if (cache.has(key)) return cache.get(key);

  const accent = ACCENTS[accentId] || ACCENTS.green;
  const t = { ...baseTokens[mode], ...accent[mode] };

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: t.accent, light: t.accent, dark: t.accentHover, contrastText: '#ffffff' },
      secondary: { main: t.accentHover, contrastText: '#ffffff' },
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.text, secondary: t.muted },
      divider: t.border,
      error:   { main: '#FA5151' },
      success: { main: t.accent },
      warning: { main: '#FA9D3B' },
      info:    { main: t.accent },
    },
    shape: { borderRadius: 8 },
    shadows: mode === 'dark'
      ? ['none','0 1px 2px rgba(0,0,0,0.4)','0 1px 3px rgba(0,0,0,0.5)','0 2px 6px rgba(0,0,0,0.5)','0 4px 12px rgba(0,0,0,0.55)','0 6px 16px rgba(0,0,0,0.6)','0 8px 24px rgba(0,0,0,0.6)','0 12px 32px rgba(0,0,0,0.65)',...Array(17).fill('0 16px 40px rgba(0,0,0,0.7)')]
      : ['none','0 1px 2px rgba(0,0,0,0.06)','0 1px 3px rgba(0,0,0,0.08)','0 2px 6px rgba(0,0,0,0.08)','0 4px 12px rgba(0,0,0,0.1)','0 6px 16px rgba(0,0,0,0.1)','0 8px 24px rgba(0,0,0,0.12)','0 12px 32px rgba(0,0,0,0.12)',...Array(17).fill('0 16px 40px rgba(0,0,0,0.14)')],
    typography: {
      fontFamily: 'var(--font-app), -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      fontFamilyCode: '"JetBrains Mono", "Fira Code", ui-monospace, Consolas, Monaco, "Courier New", monospace',
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 8 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiOutlinedInput: { styleOverrides: { root: { '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border } } } },
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: t.bg, transition: 'background-color 0.3s ease, color 0.3s ease' },
          '*::-webkit-scrollbar': { width: 8, height: 8 },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': { background: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', borderRadius: 8 },
          '*::-webkit-scrollbar-thumb:hover': { background: mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' },
        },
      },
    },
  });

  theme.palette._ = t;
  cache.set(key, theme);
  return theme;
}

export const theme = getTheme('dark', 'green');
