@echo off
echo.
echo 🚀 Starting NestJS Employee App (No Docker)
echo ==========================================
echo.

:: Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo ✅ Node.js is available
node --version

:: Copy environment file for local development
if not exist ".env" (
    echo 📋 Creating environment file...
    if exist ".env.local" (
        copy .env.local .env >nul
        echo ✅ Environment file created from .env.local
    ) else (
        echo # Local Development Configuration > .env
        echo DB_URL=mongodb://localhost:27017/employee-app >> .env
        echo JWT_SECRET=your-super-secret-jwt-key-dev >> .env
        echo JWT_EXPIRES_IN=1d >> .env
        echo RANDOM_TEXT=your-encryption-seed-dev >> .env
        echo NODE_ENV=development >> .env
        echo PORT_API_HTTP=3000 >> .env
        echo # Redis configuration - comment out if not using Redis >> .env
        echo # REDIS_URL=redis://localhost:6379 >> .env
        echo ✅ Basic environment file created
    )
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 📋 Configuration Notes:
echo   - Make sure MongoDB is running on localhost:27017
echo   - Redis is optional but recommended (localhost:6379)
echo   - Update .env file with your actual configuration
echo.

:: Run linting check
echo 🔍 Running ESLint check...
call npm run lint:check

echo.
echo 🚀 Starting NestJS application in development mode...
echo   - Application will be available at: http://localhost:3000
echo   - API Documentation: http://localhost:3000/api
echo.

:: Start the NestJS application
call npm run start:dev
