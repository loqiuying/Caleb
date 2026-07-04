import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme.js';
import AppLayout from './components/layout/AppLayout.jsx';
import SplashScreen from './components/SplashScreen.jsx';

// 主题模式 Context
export const ColorModeContext = createContext({
  mode: 'dark',
  toggle: () => {},
});
export function useColorMode() {
  return useContext(ColorModeContext);
}

// 字体 Context：三种字体方案切换
export const FONTS = [
  { id: 'system', name: '系统默认', sample: '永 和 谐' },
  { id: 'noto-sans', name: '思源黑体', sample: '永 和 谐' },
  { id: 'noto-serif', name: '思源宋体', sample: '永 和 谐' },
];
export const FontContext = createContext({ font: 'system', setFont: () => {} });
export function useFont() {
  return useContext(FontContext);
}

// 应用根组件：主题 + 字体 Provider + 开屏页
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // 深浅色模式
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  // 字体方案
  const [font, setFontState] = useState(() => {
    return localStorage.getItem('app-font') || 'system';
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('color-mode', mode);
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  // 字体持久化 + 写入 <html data-font>
  useEffect(() => {
    localStorage.setItem('app-font', font);
    document.documentElement.dataset.font = font;
  }, [font]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const setFont = (f) => setFontState(f);
  const theme = getTheme(mode);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <FontContext.Provider value={{ font, setFont, fonts: FONTS }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {showSplash && <SplashScreen />}
          <AppLayout />
        </ThemeProvider>
      </FontContext.Provider>
    </ColorModeContext.Provider>
  );
}
