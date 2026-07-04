import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme, ACCENTS } from './theme/theme.js';
import AppLayout from './components/layout/AppLayout.jsx';
import SplashScreen from './components/SplashScreen.jsx';

// 主题模式 Context
export const ColorModeContext = createContext({ mode: 'dark', toggle: () => {} });
export function useColorMode() { return useContext(ColorModeContext); }

// 字体 Context
export const FONTS = [
  { id: 'system', name: '系统默认', sample: '永 和 谐' },
  { id: 'noto-sans', name: '思源黑体', sample: '永 和 谐' },
  { id: 'noto-serif', name: '思源宋体', sample: '永 和 谐' },
];
export const FontContext = createContext({ font: 'system', setFont: () => {} });
export function useFont() { return useContext(FontContext); }

// 强调色 Context
export const ACCENT_LIST = Object.values(ACCENTS).map((a) => ({ id: a.id, name: a.name }));
export const AccentContext = createContext({ accent: 'green', setAccent: () => {} });
export function useAccent() { return useContext(AccentContext); }

// 应用根组件
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  const [font, setFontState] = useState(() => localStorage.getItem('app-font') || 'system');
  const [accent, setAccentState] = useState(() => localStorage.getItem('app-accent') || 'green');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('color-mode', mode);
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('app-font', font);
    document.documentElement.dataset.font = font;
  }, [font]);

  // 强调色持久化（写入 data-accent 便于 CSS 适配）
  useEffect(() => {
    localStorage.setItem('app-accent', accent);
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const setFont = (f) => setFontState(f);
  const setAccent = (a) => setAccentState(a);
  const theme = getTheme(mode, accent);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <FontContext.Provider value={{ font, setFont, fonts: FONTS }}>
        <AccentContext.Provider value={{ accent, setAccent, accents: ACCENT_LIST }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {showSplash && <SplashScreen />}
            <AppLayout />
          </ThemeProvider>
        </AccentContext.Provider>
      </FontContext.Provider>
    </ColorModeContext.Provider>
  );
}
