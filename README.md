# NestJS Employee App Boilerplate

A comprehensive NestJS boilerplate application with authentication, user management, workplace management, and mailing capabilities. This template provides a solid foundation for building enterprise-grade applications.

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
- **ESLint Configuration**: Pre-configured ESLint with warnings instead of errors

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
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

- Node.js (v18 or higher)
- MongoDB
- Redis
- Azure account (for email and storage services)

## ⚡ Quick Start

### 1. Clone this boilerplate
```bash
git clone https://github.com/your-username/nest-boilerplate-ea.git
cd nest-boilerplate-ea
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and configure your environment variables:
```env
# Database
DATABASE_URL=mongodb://localhost:27017/your-app-name

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1d

# Redis Cache
AZURE_CACHE_FOR_REDIS_HOST_NAME=your-redis-host
AZURE_CACHE_FOR_REDIS_ACCESS_KEY=your-redis-key

# Encryption
RANDOM_TEXT=your-encryption-key

# Azure Communication Services
AZURE_COMMUNICATION_CONNECTION_STRING=your-azure-communication-string

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage-string
```

### 4. Run the application

#### Development mode
```bash
npm run start:dev
```

#### Production mode
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, visit:
- Swagger UI: `http://localhost:3000/api`
- API JSON: `http://localhost:3000/api-json`

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Auth guards
│   └── decorators/      # Custom decorators
├── common/              # Shared utilities
│   ├── entities/        # Base entities
│   ├── interceptors/    # HTTP interceptors
│   ├── middleware/      # Custom middleware
│   ├── validators/      # Custom validators
│   └── enum/           # Enumerations
├── core/
│   ├── user/           # User management
│   └── workplace/      # Workplace management
├── mailing/            # Email services
└── main.ts            # Application entry point
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run lint` - Run ESLint with auto-fix (warnings only)
- `npm run lint:check` - Check ESLint issues without fixing
- `npm run format` - Format code with Prettier

## 🔐 Authentication

The application uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🌟 What's Included

### Pre-configured Modules
- **Auth Module**: Complete authentication system
- **User Module**: User management with RBAC
- **Workplace Module**: Multi-tenant workplace support
- **Common Module**: Shared utilities and services
- **Mailing Module**: Email system integration

### Development Tools
- **ESLint**: Pre-configured with warning-only mode
- **Prettier**: Code formatting
- **Docker**: Ready-to-use containers
- **Docker Compose**: Local development environment

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t your-app-name .
docker run -p 3000:3000 your-app-name
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment.

## 📝 Customization

This boilerplate is designed to be easily customizable:

1. **Rename the project**: Update `package.json` and other references
2. **Modify entities**: Adapt the user and workplace entities to your needs
3. **Add new modules**: Use the existing structure as a template
4. **Configure authentication**: Modify JWT settings and add OAuth if needed
5. **Update database**: Switch to PostgreSQL or other databases if required

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

If you have any questions or need help getting started:

1. Check the [documentation](https://docs.nestjs.com)
2. Open an issue on GitHub
3. Join the NestJS Discord community

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB team for the database
- Redis team for caching solution
- Azure team for cloud services

---

**Happy coding! 🎉**
