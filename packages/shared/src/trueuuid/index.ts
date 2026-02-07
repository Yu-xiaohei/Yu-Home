/**
 * TrueUUID 算法
 * 
 * 用于生成与 Minecraft 离线模式一致的 UUID
 * 算法: MD5("OfflinePlayer:" + username)
 */

/**
 * 计算 TrueUUID
 * @param username Minecraft 用户名
 * @returns UUID 格式字符串 (带连字符)
 */
export function generateTrueUUID(username: string): string {
    // 此处需要 MD5 实现，实际开发时使用 crypto 模块
    // 格式: xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx (版本3 UUID)
    throw new Error('TrueUUID 算法待实现 - 需要引入 crypto 或 crypto-js');
}

/**
 * 验证 UUID 格式
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
