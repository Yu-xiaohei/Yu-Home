# Yu-Home 开发环境规则

## 服务依赖

开发 Yu-Home 项目时，需要确保以下服务正在运行：

| 服务 | 端口 | 用途 |
|------|------|------|
| Redis | 6379 | 验证码存储、限流 |
| Casdoor | 8000 | 用户认证 |
| Auth API | 3001 | 认证接口 |

## 启动方式

使用 `/start-dev` 命令或执行：
```powershell
powershell -ExecutionPolicy Bypass -File "d:\WEB\Yu-Home\scripts\start-dev.ps1"
```

## Docker 容器

- **Redis**: `yu-home-redis` (redis:alpine)
- **Casdoor**: `casdoor` (casbin/casdoor-all-in-one)

## 注意事项

1. 确保 Docker Desktop 已启动
2. Auth API 启动前会自动清理占用端口 3001 的进程
3. 开发模式下验证码会打印在控制台日志中
