import { createHash } from 'crypto';

/**
 * TrueUUID 算法
 * 
 * 生成与 Minecraft 离线模式一致的 UUID
 * 算法: MD5("OfflinePlayer:" + username) 转换为 UUID v3 格式
 */
export function generateTrueUUID(username: string): string {
    const input = `OfflinePlayer:${username}`;
    const hash = createHash('md5').update(input).digest();

    // 设置版本号 (Version 3) 和变体位
    hash[6] = (hash[6] & 0x0f) | 0x30; // Version 3
    hash[8] = (hash[8] & 0x3f) | 0x80; // Variant

    // 转换为 UUID 格式
    const hex = hash.toString('hex');
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
    ].join('-');
}

/**
 * 验证 UUID 格式
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
