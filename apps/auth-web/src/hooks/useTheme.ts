import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Accent = 'blue' | 'yellow';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as Theme) || 'system';
        }
        return 'system';
    });

    const [accent, setAccent] = useState<Accent>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('accent') as Accent) || 'blue';
        }
        return 'blue';
    });

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;

        // 处理暗色模式
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

        const updateDark = () => {
            const shouldBeDark =
                theme === 'dark' ||
                (theme === 'system' && systemDark.matches);

            setIsDark(shouldBeDark);

            if (shouldBeDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        updateDark();
        systemDark.addEventListener('change', updateDark);

        return () => systemDark.removeEventListener('change', updateDark);
    }, [theme]);

    useEffect(() => {
        // 处理主题色
        const root = document.documentElement;
        root.setAttribute('data-accent', accent);
        localStorage.setItem('accent', accent);
    }, [accent]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        setTheme(next);
    };

    const toggleAccent = () => {
        setAccent(prev => prev === 'blue' ? 'yellow' : 'blue');
    };

    return {
        theme,
        setTheme,
        accent,
        setAccent,
        isDark,
        toggleTheme,
        toggleAccent,
    };
}
