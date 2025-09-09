# Database Setup Guide

## PostgreSQL Database Migration

This project has been migrated from Vercel Blob storage to PostgreSQL database hosted on Render.

### Environment Variables Required

Add these to your `.env` file:

```bash
# PostgreSQL Database (Render)
DATABASE_URL="postgresql://username:password@hostname:port/database"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Admin Authentication
ADMIN_USERNAME="your_admin_username"
ADMIN_PASSWORD="your_admin_password"
```

### Database Setup Steps

1. **Install dependencies:**
   ```bash
   npm install prisma @prisma/client
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Run database migration:**
   ```bash
   npx prisma db push
   ```

4. **Optional - View database in Prisma Studio:**
   ```bash
   npx prisma studio
   ```

### Architecture Overview

The application now follows SOLID principles with a clean architecture:

- **Repository Pattern**: Data access layer (`src/repositories/`)
- **Service Layer**: Business logic (`src/services/`)
- **Dependency Injection**: IoC container (`src/lib/dependency-injection.ts`)
- **Database Models**: Prisma schema (`prisma/schema.prisma`)

### Key Features Maintained

- ✅ Project CRUD operations
- ✅ Image upload to Cloudinary
- ✅ Admin panel functionality
- ✅ Three project categories (viviendas, naves-industriales, funcional)
- ✅ Image modal with navigation
- ✅ Standardized UI design

### Database Schema

The `Project` model includes:
- Basic info (title, architect, location, year, system)
- Content (description, challenge, solution, result)
- Media (coverImage, images array)
- Specifications (JSON field)
- Category enum (VIVIENDAS, NAVES_INDUSTRIALES, FUNCIONAL)
- Timestamps (createdAt, updatedAt)
