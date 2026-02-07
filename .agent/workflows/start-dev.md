---
description: 一键启动 Yu-Home 开发环境
---

# 启动开发环境

此命令会启动 Yu-Home 项目所需的所有开发服务。

## 启动的服务

| 服务 | 端口 | 容器名 |
|------|------|--------|
| Redis | 6379 | yu-home-redis |
| Casdoor | 8000 | casdoor |
| Auth API | 3001 | (本地进程) |

## 执行步骤

// turbo-all

1. 执行启动脚本
```cmd
d:\WEB\Yu-Home\scripts\start-dev.bat
```

2. 等待 Auth API 启动完成（约 10 秒）

3. 验证服务状态
```powershell
curl http://localhost:3001
```

## 手动启动单个服务

如需单独启动某个服务：

```powershell
# Redis
docker start yu-home-redis

# Casdoor
docker start casdoor

# Auth API
cd d:\WEB\Yu-Home\apps\auth-api
npm run start:dev
```
