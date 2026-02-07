import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components/ui';
import { authService } from '../services/auth';

export function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authService.login(form);
            localStorage.setItem('token', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* 标题移至外部 */}
            <div className="text-center mb-10 animate-fade-in z-10">
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-[var(--text)] drop-shadow-sm"
                    style={{ fontFamily: 'Outfit, sans-serif' }}>
                    于の小窝
                </h1>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg font-medium">
                    于的小窝统一认证平台
                </p>
            </div>

            {/* 卡片 - 增加上下距，手机端边距 */}
            <Card className="w-full max-w-[400px] px-8 py-10 mb-8 mx-4">
                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <Input
                            label="用户名"
                            type="text"
                            placeholder="请输入用户名"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-wrapper">
                        <div className="flex justify-between items-center mb-2 mx-1">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">密码</label>
                            <Link to="/forgot-password"
                                className="text-xs text-[var(--primary)] hover:underline font-medium tab-highlight-none">
                                忘记了密码？找回密码
                            </Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="请输入密码"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="mt-8 space-y-4">
                        <Button type="submit" fullWidth loading={loading} className="py-3 text-base shadow-lg shadow-[var(--primary)]/20">
                            立即登录
                        </Button>

                        {/* 注册按钮移至下方，样式变浅 */}
                        <Link to="/register" className="block">
                            <Button type="button" variant="secondary" fullWidth className="py-3">
                                注册新账号
                            </Button>
                        </Link>
                    </div>
                </form>
            </Card>

            {/* 底部版权或其他信息占位 */}
            <div className="mt-8 text-xs text-[var(--text-secondary)] opacity-60">
                &copy; 2026 Yu-Home. All rights reserved.
            </div>
        </div>
    );
}
