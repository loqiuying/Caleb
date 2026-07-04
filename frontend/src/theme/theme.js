import { createTheme } from '@mui/material/styles';

// Material Design 主题配置
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // 主色：Material Blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e', // 次色：Material Pink
      light: '#ff4081',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // 页面背景
      paper: '#ffffff', // 卡片/纸面背景
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  shape: {
    borderRadius: 8, // 统一圆角 8px
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.08),0px 1px 2px rgba(0,0,0,0.04)',
    '0px 2px 4px rgba(0,0,0,0.08),0px 1px 2px rgba(0,0,0,0.04)',
    '0px 3px 6px rgba(0,0,0,0.10),0px 2px 4px rgba(0,0,0,0.06)',
    '0px 4px 8px rgba(0,0,0,0.10),0px 2px 4px rgba(0,0,0,0.06)',
    '0px 6px 12px rgba(0,0,0,0.12),0px 3px 6px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.12),0px 4px 8px rgba(0,0,0,0.08)',
    '0px 10px 20px rgba(0,0,0,0.14),0px 4px 8px rgba(0,0,0,0.08)',
    '0px 12px 24px rgba(0,0,0,0.15),0px 6px 12px rgba(0,0,0,0.09)',
    '0px 14px 28px rgba(0,0,0,0.16),0px 6px 12px rgba(0,0,0,0.09)',
    ...Array(15).fill('0px 16px 32px rgba(0,0,0,0.18),0px 8px 16px rgba(0,0,0,0.10)'),
  ],
  typography: {
    fontFamily:
      'Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // 按钮文字不强制大写
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
  },
});
