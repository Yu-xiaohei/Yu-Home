/**
 * 共享类型定义
 */

/** 用户基础信息 */
export interface User {
    id: string;
    uuid: string;          // TrueUUID (MD5)
    username: string;
    email?: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

/** 认证来源类型 */
export type AuthSource = 'mc' | 'web';

/** 验证码类型 */
export type VerifyType = 'email' | 'sms';

/** API 响应格式 */
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data?: T;
    timestamp: number;
}

/** 分页请求参数 */
export interface PaginationParams {
    page: number;
    pageSize: number;
}

/** 分页响应数据 */
export interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
