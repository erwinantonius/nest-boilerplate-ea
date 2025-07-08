#!/bin/bash

# NestJS Employee App Boilerplate Setup Script
# This script helps you set up the project quickly

echo "🚀 NestJS Employee App Boilerplate Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies.${NC}"
    exit 1
fi

# Copy environment file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📋 Creating environment file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Environment file created. Please edit .env with your configuration.${NC}"
else
    echo -e "${YELLOW}⚠️  Environment file already exists.${NC}"
fi

# Run ESLint to check for any issues
echo -e "${YELLOW}🔍 Running ESLint check...${NC}"
npm run lint:check

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo "🎉 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB and Redis services"
echo "3. Run 'npm run start:dev' to start the development server"
echo "4. Visit http://localhost:3000/api for API documentation"
echo ""
echo "Happy coding! 🎯"
