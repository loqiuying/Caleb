import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme.js';
import AppLayout from './components/layout/AppLayout.jsx';

// 应用根组件：提供主题与全局样式重置
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout />
    </ThemeProvider>
  );
}
