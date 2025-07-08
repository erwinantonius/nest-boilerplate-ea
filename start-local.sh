#!/bin/bash

echo "🚀 Starting NestJS Employee App Locally"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 22 or higher"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -lt 22 ]; then
    echo -e "${RED}❌ Node.js version v$NODE_VERSION is too old${NC}"
    echo "Please upgrade to Node.js 22 or higher"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version v$NODE_VERSION detected${NC}"

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker and try again"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

# Stop any existing containers
echo -e "${YELLOW}📦 Stopping existing containers...${NC}"
docker-compose -f docker-compose.dev.yml down > /dev/null 2>&1

# Start MongoDB and Redis with alternative ports
echo -e "${YELLOW}🗄️  Starting MongoDB (port 27018) and Redis (port 6380)...${NC}"
docker-compose -f docker-compose.dev.yml up -d mongo redis

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check if services are running
echo -e "${GREEN}📊 Service Status:${NC}"
docker ps --filter "name=nestjs-mongo-dev" --format "table {{.Names}}\t{{.Status}}"
docker ps --filter "name=nestjs-redis-dev" --format "table {{.Names}}\t{{.Status}}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please ensure .env file exists with proper configuration"
    echo "See README.md for environment setup instructions"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}✅ Services are running:${NC}"
echo "  - MongoDB: localhost:27017"
echo "  - Redis: localhost:6379"
echo "  - MongoDB Admin: http://localhost:8081 (admin/admin123)"
echo "  - Redis Admin: http://localhost:8082"
echo ""
echo -e "${GREEN}🚀 Starting NestJS application...${NC}"
echo ""

# Start the NestJS application
npm run start:dev
