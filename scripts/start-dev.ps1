# Yu-Home 开发环境启动脚本
# 使用方法: .\scripts\start-dev.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Yu-Home 开发环境启动器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置控制台编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"

# 检查 Docker 是否运行
Write-Host "[1/4] 检查 Docker..." -ForegroundColor Yellow
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Docker 未运行，请先启动 Docker Desktop" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Docker 运行中" -ForegroundColor Green

# 启动 Redis 容器
Write-Host "[2/4] 启动 Redis..." -ForegroundColor Yellow
$redisStatus = docker inspect -f '{{.State.Running}}' yu-home-redis 2>&1
if ($redisStatus -eq "true") {
    Write-Host "  ✓ Redis 已运行 (端口 6379)" -ForegroundColor Green
} else {
    docker start yu-home-redis 2>&1 | Out-Null
    Start-Sleep -Seconds 2
    Write-Host "  ✓ Redis 已启动 (端口 6379)" -ForegroundColor Green
}

# 启动 Casdoor 容器
Write-Host "[3/4] 启动 Casdoor..." -ForegroundColor Yellow
$casdoorStatus = docker inspect -f '{{.State.Running}}' casdoor 2>&1
if ($casdoorStatus -eq "true") {
    Write-Host "  ✓ Casdoor 已运行 (端口 8000)" -ForegroundColor Green
} else {
    docker start casdoor 2>&1 | Out-Null
    Start-Sleep -Seconds 3
    Write-Host "  ✓ Casdoor 已启动 (端口 8000)" -ForegroundColor Green
}

# 启动 Auth API
Write-Host "[4/4] 启动 Auth API..." -ForegroundColor Yellow

# 检查端口 3001 是否被占用
$existingPid = (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($existingPid) {
    Write-Host "  ! 端口 3001 已被占用 (PID: $existingPid)，正在终止..." -ForegroundColor Yellow
    Stop-Process -Id $existingPid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 在新窗口中启动 Auth API
$authApiPath = "d:\WEB\Yu-Home\apps\auth-api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$authApiPath'; npm run start:dev" -WindowStyle Normal

Write-Host "  ✓ Auth API 正在启动 (端口 3001)" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  所有服务已启动!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "服务地址:" -ForegroundColor White
Write-Host "  - Auth API:  http://localhost:3001" -ForegroundColor Gray
Write-Host "  - Casdoor:   http://localhost:8000" -ForegroundColor Gray
Write-Host "  - Redis:     localhost:6379" -ForegroundColor Gray
Write-Host ""
