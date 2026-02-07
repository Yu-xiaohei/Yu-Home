# 于の认证平台 API (Yu Auth API)

认证平台后端服务，基于 NestJS + Casdoor (Headless 模式)。

## 技术栈

- **框架**: NestJS v11
- **认证**: Casdoor (Headless) + JWT
- **验证**: 邮箱验证码 / 阿里云短信
- **缓存**: Redis (验证码存储)
- **限流**: @nestjs/throttler

## 核心模块

| 模块 | 说明 |
|------|------|
| `auth` | 认证核心逻辑 |
| `casdoor` | Casdoor API 集成 |
| `verify` | 验证码服务 (邮箱/短信) |
| `user` | 用户管理 |

## 启动

```bash
npm run start:dev
```

## 环境变量

复制 `.env.example` 到 `.env` 并配置相关参数。
