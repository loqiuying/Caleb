import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme.js';
import AppLayout from './components/layout/AppLayout.jsx';
import SplashScreen from './components/SplashScreen.jsx';

// 应用根组件：提供主题与全局样式重置
// 首次加载时显示开屏页 2 秒，然后淡出进入主界面
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 2.5 秒后卸载 Splash（CSS 在 2s 开始淡出，0.5s 完成）
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSplash && <SplashScreen />}
      <AppLayout />
    </ThemeProvider>
  );
}
