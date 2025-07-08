@echo off
echo.
echo 🛑 Stopping NestJS Employee App Services
echo ========================================
echo.

:: Stop Docker containers
echo 📦 Stopping MongoDB and Redis containers...
docker-compose -f docker-compose.dev.yml down

:: Remove containers (optional)
echo 🗑️  Removing containers...
docker-compose -f docker-compose.dev.yml down --volumes

echo.
echo ✅ All services stopped successfully!
echo.
pause
