@echo off
echo.
echo 🚀 Starting NestJS Employee App Locally
echo =====================================
echo.

:: Check Node.js version
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
if "%NODE_VERSION%"=="" (
    echo ❌ Node.js is not installed
    echo Please install Node.js 22 or higher
    pause
    exit /b 1
)

:: Extract major version number (remove 'v' prefix and get first part)
set NODE_MAJOR=%NODE_VERSION:~1,2%
if %NODE_MAJOR% lss 22 (
    echo ❌ Node.js version %NODE_VERSION% is too old
    echo Please upgrade to Node.js 22 or higher
    pause
    exit /b 1
)

echo ✅ Node.js version %NODE_VERSION% detected

:: Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not running
    echo Please install Docker Desktop and start it
    pause
    exit /b 1
)

:: Stop any existing containers
echo 📦 Stopping existing containers...
docker-compose -f docker-compose.dev.yml down >nul 2>&1

:: Start MongoDB and Redis with alternative ports
echo 🗄️  Starting MongoDB (port 27018) and Redis (port 6380)...
docker-compose -f docker-compose.dev.yml up -d mongo redis

:: Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

:: Check if services are running
docker ps --filter "name=nestjs-mongo-dev" --format "table {{.Names}}\t{{.Status}}"
docker ps --filter "name=nestjs-redis-dev" --format "table {{.Names}}\t{{.Status}}"

:: Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found
    echo Please ensure .env file exists with proper configuration
    echo See README.md for environment setup instructions
    pause
    exit /b 1
)

echo ✅ Environment file found

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

echo.
echo ✅ Services are running:
echo   - MongoDB: localhost:27018
echo   - Redis: localhost:6380
echo   - MongoDB Admin: http://localhost:8081 (admin/admin123)
echo   - Redis Admin: http://localhost:8082
echo.
echo 🚀 Starting NestJS application...
echo.

:: Start the NestJS application
call npm run start:dev
