# 于の小窝 (Yu-Home)

> Minecraft 服务器 × Web 生态系统的综合项目

## 🎮 项目简介

**于の小窝** 是一个集成了 Minecraft (Fabric) 服务器与 Web 生态系统的综合项目，由 **Yu_xiaohei** 开发。

## 🏗️ 项目架构

```
Yu-Home/
├── apps/                  # 应用模块
│   ├── auth-web/          # 认证平台前端 (React + Tailwind CSS)
│   ├── auth-api/          # 认证平台后端 (NestJS + Casdoor)
│   ├── bridge/            # 后端中台 (NestJS + TypeORM + Redis)
│   └── web/               # 官网主站 (Next.js)
├── packages/              # 共享包
│   ├── shared/            # 共享类型和工具
│   ├── ui/                # 共享 UI 组件库
│   └── config/            # 共享配置
└── docs/                  # 文档
```

## 🌐 域名规划

| 模块 | 域名 | 说明 |
|------|------|------|
| 认证平台 | auth.yxhmc.cn | 统一身份认证 |
| 后端中台 | api.yxhmc.cn | API 服务 |
| 游戏服务 | mc.yxhmc.cn | MC 服务器入口 |
| 官网主站 | www.yxhmc.cn | 首页官网 |

## ✨ 核心特性

### 于の登录认证平台 (Yu Auth)
- **变色龙 UI 系统**: 根据来源自动切换游戏风/极简风
- **多方式验证**: 邮箱验证码 + 阿里云短信验证码
- **TrueUUID 算法**: 确保离线 UUID 一致性

### 官网主站
- **响应式设计**: PC 16:9 / 手机 9:16 自适应
- **动态视频背景**: 沉浸式视觉体验
- **HyperOS/Apple 风格**: 极简动效设计

### 后端中台 (Bridge)
- **统一鉴权**: JWT Token 验证
- **MC 模组接入**: Fabric Mod 通信接口
- **直播弹幕预留**: Phase 2 开发

## 🛠️ 技术栈

- **前端**: React, Next.js, Tailwind CSS
- **后端**: NestJS, TypeORM, Casdoor
- **数据库**: MySQL, Redis
- **部署**: Docker, 阿里云

## 📦 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build
```

## 📄 许可证

MIT License © Yu_xiaohei
