import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components/ui';
import { authService } from '../services/auth';

const countryCodes = [
    { code: '+86', label: 'CN' },
    { code: '+886', label: 'TW' },
    { code: '+852', label: 'HK' },
];

export function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [countryCode, setCountryCode] = useState('+86');

    const [form, setForm] = useState({
        username: '',
        contact: '',
        password: '',
        confirmPassword: '',
        verifyCode: '',
    });

    const isPhoneNumber = useMemo(() => {
        // 简单判断：纯数字且长度大于6
        const val = form.contact.trim();
        return /^\d{6,}$/.test(val);
    }, [form.contact]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendCode = async () => {
        if (!form.contact) {
            setError('请输入邮箱或手机号');
            return;
        }

        setSendingCode(true);
        setError('');

        try {
            const target = isPhoneNumber ? `${countryCode}${form.contact}` : form.contact;
            const type = isPhoneNumber ? 'sms' : 'email';
            await authService.sendCode(target, type);
            setCountdown(60);
        } catch (err: any) {
            setError(err.response?.data?.message || '发送失败');
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('两次密码不一致');
            return;
        }

        setLoading(true);

        try {
            const target = isPhoneNumber ? `${countryCode}${form.contact}` : form.contact;
            await authService.register({
                username: form.username,
                email: isPhoneNumber ? undefined : form.contact,
                phone: isPhoneNumber ? target : undefined,
                password: form.password,
                verifyCode: form.verifyCode,
                verifyType: isPhoneNumber ? 'sms' : 'email',
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8 animate-fade-in z-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    创建账号
                </h1>
                <p className="text-[var(--text-secondary)]">
                    加入于の小窝
                </p>
            </div>

            <Card className="w-full max-w-[400px] px-8 py-10 mb-8 mx-4">
                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <Input
                            label="用户名"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            placeholder="3-16字符"
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <label className="input-label">邮箱地址 / 手机号</label>
                        <div className="flex relative">
                            {/* 手机号前缀选择 - 仅在检测到手机号时显示 */}
                            <div
                                className={`transition-all duration-300 overflow-hidden flex items-center ${isPhoneNumber ? 'w-[70px] opacity-100 mr-2' : 'w-0 opacity-0 mr-0'}`}
                            >
                                <select
                                    className="w-full h-full bg-[var(--glass-border)] rounded-xl border border-[var(--glass-border)] text-sm px-1 outline-none text-[var(--text)]"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    {countryCodes.map(c => (
                                        <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                className="flex-1"
                                value={form.contact}
                                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                placeholder="邮箱或手机号"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label className="input-label">验证码</label>
                        <div className="flex gap-3">
                            <Input
                                className="flex-1"
                                value={form.verifyCode}
                                onChange={(e) => setForm({ ...form, verifyCode: e.target.value })}
                                placeholder="6位验证码"
                                maxLength={6}
                                required
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleSendCode}
                                disabled={sendingCode || countdown > 0}
                                className="shrink-0 min-w-[80px]"
                            >
                                {countdown > 0 ? `${countdown}s` : '发送'}
                            </Button>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <Input
                            label="密码"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="至少6位"
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <Input
                            label="确认密码"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            placeholder="再次输入"
                            required
                        />
                    </div>

                    <div className="mt-8">
                        <Button type="submit" fullWidth loading={loading} className="py-3 shadow-lg shadow-[var(--primary)]/20">
                            立即注册
                        </Button>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                                已有账号？<span className="font-semibold underline decoration-2 underline-offset-4">去登录</span>
                            </Link>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}
