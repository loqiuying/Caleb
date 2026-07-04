import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme.js';
import AppLayout from './components/layout/AppLayout.jsx';
import SplashScreen from './components/SplashScreen.jsx';

// 主题模式 Context：组件树任意位置可读写当前模式
export const ColorModeContext = createContext({
  mode: 'dark',
  toggle: () => {},
});

// 自定义 hook：方便组件取当前模式与切换函数
export function useColorMode() {
  return useContext(ColorModeContext);
}

// 应用根组件：主题 Provider + 深浅色切换 + 开屏页
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // 初始模式：localStorage 优先，否则跟随系统偏好，默认 dark
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  // 2.5s 后卸载 splash
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 持久化 + 写入 <html data-mode> 便于 CSS 适配
  useEffect(() => {
    localStorage.setItem('color-mode', mode);
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const theme = getTheme(mode);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showSplash && <SplashScreen />}
        <AppLayout />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
