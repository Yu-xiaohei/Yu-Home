import { useTheme } from '../hooks/useTheme';

const SunIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const SystemIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

type ThemeMode = 'light' | 'dark' | 'system';

const modes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: '浅色', icon: <SunIcon /> },
    { id: 'dark', label: '深色', icon: <MoonIcon /> },
    { id: 'system', label: '跟随系统', icon: <SystemIcon /> },
];

export function ThemeToggle() {
    const { theme, setTheme, accent, toggleAccent } = useTheme();

    return (
        <div className="fixed top-6 right-6 flex items-center gap-4 z-50 animate-fade-in">
            {/* 模式切换 - 横排三个按钮 */}
            <div className="theme-toggle-container glass-card !rounded-full !p-1 !border-opacity-50">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setTheme(mode.id)}
                        className={`theme-btn ${theme === mode.id ? 'active' : ''}`}
                        title={mode.label}
                    >
                        {mode.icon}
                        <span>{mode.label}</span>
                    </button>
                ))}
            </div>

            {/* 主题色切换 - 圆形按钮 */}
            <button
                onClick={toggleAccent}
                className="glass-card !rounded-full w-10 h-10 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                title="切换主题色"
            >
                <div
                    className="w-5 h-5 rounded-full ring-2 ring-offset-2 ring-offset-transparent transition-all"
                    style={{
                        backgroundColor: accent === 'blue' ? '#3b82f6' : '#fce747',
                        boxShadow: `0 0 10px ${accent === 'blue' ? '#3b82f6' : '#fce747'}`
                    }}
                />
            </button>
        </div>
    );
}
