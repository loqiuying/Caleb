import { createTheme } from '@mui/material/styles';

/**
 * 主题配置：微信/QQ 个人聊天风格
 *
 * 浅色（对标微信）：
 *   聊天背景米色 #EDEDED，气泡白 #FFF / 微信绿 #95EC69
 *   顶栏侧栏白 #FFF，强调色微信绿 #07C160
 *
 * 深色：现代深色，气泡深灰 / 深绿
 */

export const tokens = {
  light: {
    bg:            '#EDEDED',  // 微信聊天背景米色
    surface:       '#FFFFFF',  // 顶栏/侧栏/卡片
    subtle:        '#F5F5F5',  // hover、次级
    border:        '#E5E5E5',
    text:          '#1A1A1A',
    muted:         '#888888',
    accent:        '#07C160',  // 微信绿
    accentHover:   '#06AD56',
    accentSoft:    '#E6F7EC',  // 微信绿浅底
    codeBg:        '#1e1e2e',
    codeText:      '#cdd6f4',
    // 气泡
    bubbleUser:     '#95EC69',  // 经典微信绿气泡
    bubbleUserText: '#1A1A1A',  // 绿气泡上用深字（微信特征）
    bubbleAi:       '#FFFFFF',  // AI 白气泡
    bubbleAiText:   '#1A1A1A',
    bubbleAiBorder: '#E5E5E5',
  },
  dark: {
    bg:            '#111111',  // 微信深色聊天背景
    surface:       '#1F1F1F',  // 顶栏/侧栏
    subtle:        '#2A2A2A',
    border:        '#2E2E2E',
    text:          '#E6E6E6',
    muted:         '#999999',
    accent:        '#07C160',  // 微信绿（深色下也用同色，足够亮）
    accentHover:   '#06AD56',
    accentSoft:    'rgba(7, 193, 96, 0.16)',
    codeBg:        '#11111b',
    codeText:      '#cdd6f4',
    bubbleUser:     '#2E5A3E',  // 深绿气泡
    bubbleUserText: '#E6E6E6',
    bubbleAi:       '#2A2A2A',  // 深灰气泡
    bubbleAiText:   '#E6E6E6',
    bubbleAiBorder: '#2E2E2E',
  },
};

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
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.text, secondary: t.muted },
      divider: t.border,
      error:   { main: '#FA5151' },   // 微信红
      success: { main: t.accent },
      warning: { main: '#FA9D3B' },
      info:    { main: t.accent },
    },
    shape: { borderRadius: 8 },
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
          '0 1px 2px rgba(0,0,0,0.06)',
          '0 1px 3px rgba(0,0,0,0.08)',
          '0 2px 6px rgba(0,0,0,0.08)',
          '0 4px 12px rgba(0,0,0,0.1)',
          '0 6px 16px rgba(0,0,0,0.1)',
          '0 8px 24px rgba(0,0,0,0.12)',
          '0 12px 32px rgba(0,0,0,0.12)',
          ...Array(17).fill('0 16px 40px rgba(0,0,0,0.14)'),
        ],
    typography: {
      fontFamily: 'var(--font-app), -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      fontFamilyCode:
        '"JetBrains Mono", "Fira Code", ui-monospace, Consolas, Monaco, "Courier New", monospace',
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
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
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '*::-webkit-scrollbar': { width: 8, height: 8 },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            background: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
            borderRadius: 8,
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          },
        },
      },
    },
  });

  theme.palette._ = t;
  cache[mode] = theme;
  return theme;
}

export const theme = getTheme('dark');
