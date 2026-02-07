import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components/ui';
import { authService } from '../services/auth';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [form, setForm] = useState({
        email: '',
        verifyCode: '',
        newPassword: '',
    });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendCode = async () => {
        if (!form.email) {
            alert('请输入邮箱');
            return;
        }

        setLoading(true);
        try {
            await authService.sendCode(form.email, 'email');
            setCountdown(60);
            setStep('code');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || '发送验证码失败');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = () => {
        setStep('reset');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8 animate-fade-in z-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                    找回密码
                </h1>
                <p className="text-[var(--text-secondary)]">
                    重置您的安全密码
                </p>
            </div>

            <Card className="w-full max-w-[400px] px-8 py-10 mb-8 mx-4">
                {step === 'email' && (
                    <div className="animate-fade-in">
                        <div className="input-wrapper">
                            <Input
                                label="邮箱地址"
                                placeholder="请输入注册邮箱"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <Button fullWidth onClick={handleSendCode} className="mt-4">下一步</Button>
                    </div>
                )}

                {step === 'code' && (
                    <div className="animate-fade-in">
                        <div className="input-wrapper">
                            <label className="input-label">验证码</label>
                            <div className="flex gap-3">
                                <Input
                                    className="flex-1"
                                    placeholder="6位验证码"
                                    value={form.verifyCode}
                                    onChange={e => setForm({ ...form, verifyCode: e.target.value })}
                                />
                                <Button variant="secondary" className="shrink-0" disabled={countdown > 0}>
                                    {countdown > 0 ? `${countdown}s` : '重发'}
                                </Button>
                            </div>
                        </div>
                        <Button fullWidth onClick={handleVerify} className="mt-4">验证</Button>
                    </div>
                )}

                {step === 'reset' && (
                    <form onSubmit={handleSubmit} className="animate-fade-in">
                        <div className="input-wrapper">
                            <Input
                                label="新密码"
                                type="password"
                                placeholder="至少6位"
                                value={form.newPassword}
                                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                            />
                        </div>
                        <Button type="submit" fullWidth loading={loading} className="mt-4">完成重置</Button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]">
                        返回登录
                    </Link>
                </div>
            </Card>
        </div>
    );
}
