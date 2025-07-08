# NestJS Employee App Boilerplate

A clean, production-ready NestJS boilerplate featuring authentication, user management, workplace management, and mailing capabilities. Perfect starting point for enterprise applications.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete CRUD operations for users with role permissions
- **Workplace Management**: Manage different workplaces and their details
- **Document Numbering**: Automated document numbering system
- **Mailing System**: Email functionality with templates
- **Caching**: Redis integration for improved performance
- **Encryption**: Built-in encryption/decryption utilities
- **Activity Logging**: User activity tracking
- **Password Management**: Secure password reset functionality

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js v22+)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport
- **Caching**: Redis
- **Validation**: Class Validator & Class Transformer
- **Documentation**: Swagger/OpenAPI
- **Email**: Azure Communication Services
- **Storage**: Azure Blob Storage
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

- Node.js (v22 or higher)
- Docker Desktop (for easy local development)
- Azure account (optional, for email and storage services)

## ⚡ Quick Start

### Easy Setup with Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/erwinantonius/nest-boilerplate-ea.git
cd nest-boilerplate-ea

# Start everything with one command
start-local.bat    # Windows
./start-local.sh   # macOS/Linux
```

This will:
- Check Node.js version (requires v22+)
- Start MongoDB and Redis with Docker
- Install dependencies
- Start the NestJS application

### Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Start database services
docker-compose -f docker-compose.dev.yml up -d

# 3. Start the application
npm run start:dev
```

## 📝 Environment Configuration

The `.env` file is pre-configured for local development:

```env
# Database (local MongoDB running on port 27018 via Docker)
DB_URL=mongodb://localhost:27018/your-app-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=1d

# Redis (optional, running on port 6380 via Docker)
REDIS_URL=redis://localhost:6380

# Application
CLIENT_URL=localhost:9000
PORT_API_HTTP=3000

# Azure Services (optional)
AZURE_MAIL_SENDER=your-sender@email.com
AZURE_MAIL_CONNSTRING=your-connection-string
```

**For production, update these values with your actual credentials.**

## 🌐 Access Points

Once running:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **MongoDB Admin**: http://localhost:8081 (admin/admin123)
- **Redis Admin**: http://localhost:8082

## 🧪 Development Commands

```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start in debug mode

# Testing
npm run test            # Unit tests
npm run test:e2e        # E2E tests
npm run test:cov        # Test coverage

# Code Quality
npm run lint            # ESLint check and fix
npm run format          # Prettier formatting
npm run build           # Build for production
```

## 🐳 Docker Support

### Development (MongoDB + Redis only)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production (Full stack)
```bash
docker-compose up -d
```

**Custom Ports (to avoid conflicts):**
- MongoDB: 27018 (not 27017)
- Redis: 6380 (not 6379)

## 🔐 Authentication

Include JWT token in requests:
```
Authorization: Bearer <your-jwt-token>
```

## 🚀 Production Deployment

Update `.env` for production:
```env
NODE_ENV=production
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/your-database
REDIS_URL=redis://your-redis-host:6379
JWT_SECRET=your-super-secure-secret
AZURE_MAIL_CONNSTRING=your-production-connection-string
```

## 🛠️ Troubleshooting

**MongoDB Connection Issues:**
- Ensure Docker is running
- Check port 27018 availability
- Restart: `docker-compose -f docker-compose.dev.yml restart`

**Node.js Version:**
- Requires v22+
- Use nvm: `nvm install 22 && nvm use 22`

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.
