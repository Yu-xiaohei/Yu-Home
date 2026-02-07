import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ThemeToggle } from './components/ThemeToggle';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      {/* 动态背景 */}
      <AnimatedBackground />

      {/* 主题切换 */}
      <ThemeToggle />

      {/* 路由 */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
