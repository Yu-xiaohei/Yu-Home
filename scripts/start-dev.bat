@echo off
chcp 65001 > nul
title Yu-Home Dev Environment

echo ========================================
echo   Yu-Home Dev Environment Starter
echo ========================================
echo.

echo [1/4] Checking Docker...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo   X Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo   OK - Docker is running

echo [2/4] Starting Redis...
docker inspect -f "{{.State.Running}}" yu-home-redis > nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('docker inspect -f "{{.State.Running}}" yu-home-redis') do set REDIS_STATUS=%%i
    if "!REDIS_STATUS!"=="true" (
        echo   OK - Redis already running (port 6379^)
    ) else (
        docker start yu-home-redis > nul 2>&1
        echo   OK - Redis started (port 6379^)
    )
) else (
    docker start yu-home-redis > nul 2>&1
    echo   OK - Redis started (port 6379^)
)

echo [3/4] Starting Casdoor...
docker inspect -f "{{.State.Running}}" casdoor > nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('docker inspect -f "{{.State.Running}}" casdoor') do set CASDOOR_STATUS=%%i
    if "!CASDOOR_STATUS!"=="true" (
        echo   OK - Casdoor already running (port 8000^)
    ) else (
        docker start casdoor > nul 2>&1
        echo   OK - Casdoor started (port 8000^)
    )
) else (
    docker start casdoor > nul 2>&1
    echo   OK - Casdoor started (port 8000^)
)

echo [4/4] Starting Auth API...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo   ! Port 3001 in use, killing process %%a...
    taskkill /PID %%a /F > nul 2>&1
    timeout /t 1 > nul
)

start "Auth API" cmd /k "cd /d d:\WEB\Yu-Home\apps\auth-api && npm run start:dev"
echo   OK - Auth API starting (port 3001^)

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo Service URLs:
echo   - Auth API:  http://localhost:3001
echo   - Casdoor:   http://localhost:8000
echo   - Redis:     localhost:6379
echo.
pause
