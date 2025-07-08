@echo off
setlocal

:: NestJS Employee App Boilerplate Setup Script
:: This script helps you set up the project quickly

echo.
echo 🚀 NestJS Employee App Boilerplate Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

:: Display Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

:: Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

:: Copy environment file
if not exist ".env" (
    echo.
    echo 📋 Creating environment file...
    copy .env.example .env >nul
    echo ✅ Environment file created. Please edit .env with your configuration.
) else (
    echo.
    echo ⚠️  Environment file already exists.
)

:: Run ESLint to check for any issues
echo.
echo 🔍 Running ESLint check...
call npm run lint:check

echo.
echo ✅ Setup completed successfully!
echo.
echo 🎉 Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start MongoDB and Redis services
echo 3. Run 'npm run start:dev' to start the development server
echo 4. Visit http://localhost:3000/api for API documentation
echo.
echo Happy coding! 🎯
echo.
pause
