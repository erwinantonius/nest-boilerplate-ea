# Database Seeders

This directory contains database seeders for populating the application with initial data.

## Available Seeders

### 1. WorkplaceSeeder
Seeds 2 workplaces:
- **Head Office Jakarta** - Main office with full admin access
- **Branch Office Surabaya** - Regional branch office

### 2. UserSeeder
Seeds 2 users:
- **Admin User** - Superadmin with access to Head Office
  - Email: `admin@company.com`
  - Password: `admin123`
  - Role: SUPERADMIN
- **Employee User** - Regular employee in Branch Office
  - Email: `employee@company.com`
  - Password: `employee123`
  - Role: EMPLOYEE

## Usage

### Command Line Interface

```bash
# Seed all data (workplaces and users)
npm run seed

# Clear all seeded data
npm run seed:clear

# Clear and reseed all data
npm run seed:reseed
```

### API Endpoints (Admin Only)

After authentication as a superadmin, you can use these API endpoints:

```bash
# Seed all data
POST /api/seeders/seed

# Clear all data
DELETE /api/seeders/clear

# Clear and reseed all data
POST /api/seeders/reseed
```

## Seeder Details

### Data Created

**Workplaces:**
1. Head Office Jakarta (HO-JKT)
2. Branch Office Surabaya (BR-SBY)

**Users:**
1. System Admin (admin@company.com)
2. Demo Employee (employee@company.com)

### Dependencies

- Workplaces must be seeded before users (users reference workplaces)
- Users are created with hashed passwords using bcrypt
- All seeded data includes `created_by: 'system'` for tracking

### Safety Features

- Seeders check for existing data before creating new records
- Clear operations only affect seeded data
- Passwords are properly hashed before storage
- All operations are logged for debugging

## Development Notes

- Seeders are only intended for development and testing
- Production environments should have proper user registration flows
- Default passwords should be changed immediately after seeding
- Seeded data includes realistic Indonesian locations and contact information
