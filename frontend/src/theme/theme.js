import { createTheme } from '@mui/material/styles';

// 浅蓝色 + 暗色背景 + 微信/QQ 风格主题配置
// 颜色规范：
//   背景色：#0a0a0f（主背景）, #13131a（卡片背景）, #1a1a24（侧边栏）
//   气泡色：#4FC3F7（用户/浅蓝）, #2A2A35（AI/深灰）
//   文字色：#FFFFFF（主文字）, #888899（次要文字）
//   强调色：#4FC3F7（浅蓝）, #29B6F6（亮蓝）
//   输入框：#1E1E28（背景）
//   分割线：#252530

export const COLORS = {
  // 背景
  bgMain: '#0a0a0f',
  bgCard: '#13131a',
  bgSidebar: '#1a1a24',
  bgInput: '#1E1E28',
  // 气泡
  bubbleUser: '#4FC3F7',
  bubbleAi: '#2A2A35',
  // 文字
  textPrimary: '#FFFFFF',
  textSecondary: '#888899',
  // 强调
  accent: '#4FC3F7',
  accentBright: '#29B6F6',
  // 分割线
  divider: '#252530',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FC3F7', // 浅蓝主色
      light: '#29B6F6',
      dark: '#0288D1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0277BD',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0f', // 主背景
      paper: '#13131a', // 卡片/纸面背景
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#888899',
    },
    divider: '#252530',
    error: {
      main: '#ef5350',
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#4FC3F7',
    },
  },
  shape: {
    borderRadius: 12, // 微信风格圆角 12px
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.4),0px 1px 2px rgba(0,0,0,0.3)',
    '0px 2px 4px rgba(0,0,0,0.4),0px 1px 2px rgba(0,0,0,0.3)',
    '0px 3px 6px rgba(0,0,0,0.45),0px 2px 4px rgba(0,0,0,0.32)',
    '0px 4px 8px rgba(0,0,0,0.45),0px 2px 4px rgba(0,0,0,0.32)',
    '0px 6px 12px rgba(0,0,0,0.5),0px 3px 6px rgba(0,0,0,0.36)',
    '0px 8px 16px rgba(0,0,0,0.5),0px 4px 8px rgba(0,0,0,0.36)',
    '0px 10px 20px rgba(0,0,0,0.55),0px 4px 8px rgba(0,0,0,0.36)',
    '0px 12px 24px rgba(0,0,0,0.55),0px 6px 12px rgba(0,0,0,0.4)',
    '0px 14px 28px rgba(0,0,0,0.6),0px 6px 12px rgba(0,0,0,0.4)',
    ...Array(15).fill('0px 16px 32px rgba(0,0,0,0.6),0px 8px 16px rgba(0,0,0,0.44)'),
  ],
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif',
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#252530',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0f',
        },
        // 滚动条适配深色
        '*::-webkit-scrollbar': {
          width: 6,
          height: 6,
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 3,
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255,255,255,0.2)',
        },
      },
    },
  },
});
