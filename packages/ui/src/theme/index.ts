/**
 * 变色龙主题系统 (Chameleon Theme System)
 * 
 * 根据 URL 参数 source 自动切换主题:
 * - source=mc: 游戏风主题 (Minecraft 像素风格)
 * - source=web: 极简风主题 (HyperOS/Apple 风格)
 */

export type ThemeSource = 'mc' | 'web';

export interface ThemeConfig {
    source: ThemeSource;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        accent: string;
        error: string;
        success: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    spacing: {
        unit: number;
    };
    borderRadius: string;
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
}

/** 游戏风主题 (Minecraft 风格) */
export const mcTheme: ThemeConfig = {
    source: 'mc',
    colors: {
        primary: '#5B8731',      // Minecraft 草地绿
        secondary: '#8B5A2B',    // Minecraft 泥土棕
        background: '#1A1A2E',   // 深夜空色
        surface: '#252538',      // 暗紫黑色
        text: '#FFFFFF',
        textSecondary: '#A0A0B0',
        accent: '#FFD700',       // 金色
        error: '#FF4444',
        success: '#44FF44',
    },
    fonts: {
        heading: '"Press Start 2P", "Minecraft", monospace',
        body: '"VT323", "Minecraft", monospace',
    },
    spacing: { unit: 8 },
    borderRadius: '0px',       // 像素风无圆角
    transitions: {
        fast: '100ms',
        normal: '200ms',
        slow: '400ms',
    },
};

/** 极简风主题 (HyperOS/Apple 风格) */
export const webTheme: ThemeConfig = {
    source: 'web',
    colors: {
        primary: '#007AFF',      // Apple 蓝
        secondary: '#5856D6',    // 紫色
        background: '#000000',   // 纯黑
        surface: '#1C1C1E',      // 深灰
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        accent: '#FF9500',       // 橙色
        error: '#FF3B30',
        success: '#30D158',
    },
    fonts: {
        heading: '"SF Pro Display", "PingFang SC", -apple-system, sans-serif',
        body: '"SF Pro Text", "PingFang SC", -apple-system, sans-serif',
    },
    spacing: { unit: 8 },
    borderRadius: '12px',
    transitions: {
        fast: '150ms ease-out',
        normal: '300ms ease-out',
        slow: '500ms ease-out',
    },
};

/** 根据来源获取主题 */
export function getTheme(source: ThemeSource): ThemeConfig {
    return source === 'mc' ? mcTheme : webTheme;
}

/** 从 URL 解析主题来源 */
export function parseThemeSource(url: string): ThemeSource {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const source = params.get('source');
    return source === 'mc' ? 'mc' : 'web';
}
