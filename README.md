# 🚀 NestJS Project Setup Guide

![Project Cover](assets/cover.png)

Complete step-by-step instructions to set up and run the NestJS boilerplate project.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Environment Files Overview](#-environment-files-overview)
3. [Initial Setup](#-initial-setup)
4. [Running the Project](#-running-the-project)
5. [Database Management](#-database-management)
6. [Available Scripts](#-available-scripts)
7. [Troubleshooting](#-troubleshooting)

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

Verify installations:

```bash
node --version
npm --version
docker --version
docker compose version
```

---

## 📁 Environment Files Overview

The project uses three environment files:

| File               | Purpose            | When to Use                                  |
| ------------------ | ------------------ | -------------------------------------------- |
| **`.env`**         | Local development  | Running NestJS locally (outside Docker)      |
| **`.env.docker`**  | Docker environment | Running with Docker Compose                  |
| **`.example.env`** | Template file      | Reference for creating new environment files |

### 🔐 Environment File Locations

All environment files are located in: `src/environment/`

---

## 🎯 Initial Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Files

#### Option A: Local Development (without Docker for app)

1. Copy the example environment file:

```bash
cp src/environment/.example.env src/environment/.env
```

2. Edit `src/environment/.env` with your configuration:

```env
# ===========================
# Application Configuration
# ===========================
PORT=3535
API_HOST=0.0.0.0
NODE_ENV=development
API_VERSION=1
LOG_LEVEL=debug

# Secrets
JWT_SECRET=key_name
SESSION_SECRET=key_name
PUBLIC_KEY=isPublic

# Monitoring / Error Tracking
SENTRY_DSN=https://yourPublicKey@o123456.ingest.sentry.io/1234567

# ===========================
# Database Configuration
# ===========================
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_boilerplate_db

# ===========================
# Swagger Configuration
# ===========================
SWAGGER_URL=api-docs
SWAGGER_TITLE="NestJS Boilerplate"
SWAGGER_DESCRIPTION="A scalable NestJS boilerplate with libs, modules, TypeORM, and PostgreSQL"
SWAGGER_VERSION=1
```

#### Option B: Docker Environment

1. Copy the example Docker environment file:

```bash
cp src/environment/.example.env src/environment/.env.docker
```

2. Edit `src/environment/.env.docker`:

```env
# ===========================
# PostgreSQL Configuration
# ===========================
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nestjs_boilerplate_db

# ===========================
# pgAdmin Configuration
# ===========================
PGADMIN_PORT=5051
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=postgres
```

---

## 🏃 Running the Project

### Method 1: Local Development (Recommended for Development)

This runs the NestJS app locally while using Docker for the database only.

#### Step 1: Start Database Services

```bash
npm run docker:up:db
```

This command:

- Starts PostgreSQL container
- Starts pgAdmin container
- Uses configurations from `.env.docker`

#### Step 2: Wait for Database to Initialize

Wait about 10-15 seconds for PostgreSQL to fully start.

#### Step 3: Run Database Migrations

```bash
npm run migration:run
```

#### Step 4: (Optional) Seed the Database

```bash
npm run seed
```

#### Step 5: Start the Development Server

```bash
npm run start:dev
```

The application will be available at:

- **API**: `http://localhost:3535`
- **Swagger Docs**: `http://localhost:3535/api-docs`
- **pgAdmin**: `http://localhost:5051`

### Method 2: Full Docker Setup

Run everything in Docker (useful for production-like environments):

```bash
# Start all services including the app
npm run docker:up:db

# In another terminal, access the app container
docker exec -it <container-name> npm run migration:run
docker exec -it <container-name> npm run seed
```

---

## 🗄 Database Management

### Accessing pgAdmin

1. Open browser: `http://localhost:5051`
2. Login with credentials from `.env.docker`:
   - Email: `admin@admin.com`
   - Password: `postgres`
3. Add new server:
   - **Host**: `postgres` (Docker service name) or `localhost` (local)
   - **Port**: `5432`
   - **Username**: `postgres`
   - **Password**: `postgres`
   - **Database**: `nestjs_boilerplate_db`

### Managing Migrations

#### Generate a New Migration

```bash
npm run migration:generate -- MigrationName
```

#### Run Pending Migrations

```bash
npm run migration:run
```

#### Revert Last Migration

```bash
npm run migration:revert
```

### Seeding Data

```bash
npm run seed
```

---

## 📜 Available Scripts

### Development

```bash
npm run start:dev          # Start development server with hot-reload
npm run start:debug        # Start with debugging enabled
npm run build              # Build the project for production
```

### Production

```bash
npm run start:prod         # Run production build
npm run start              # Alternative production start
```

### Code Quality

```bash
npm run lint               # Lint and auto-fix TypeScript files
npm run format             # Format code with Prettier
```

### Docker

```bash
npm run docker:up:db       # Start database services (PostgreSQL + pgAdmin)
npm run docker:down        # Stop and remove all containers
npm run docker:logs        # View container logs
```

### Database

```bash
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run seed               # Seed database with initial data
```

---

## 🐛 Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Find process using the port
lsof -i :3535  # or :5432, :5051

# Kill the process
kill -9 <PID>
```

Or change the port in your `.env` file.

### Database Connection Failed

1. Ensure Docker containers are running:

```bash
docker ps
```

2. Check if PostgreSQL is ready:

```bash
docker logs <postgres-container-name>
```

3. Verify database credentials match in both `.env` and `.env.docker`

### Migration Errors

If migrations fail:

```bash
# Stop all containers
npm run docker:down

# Remove volumes (⚠️ This deletes all data)
docker volume prune

# Restart
npm run docker:up:db
npm run migration:run
```

### Docker Build Issues

Clear Docker cache and rebuild:

```bash
docker system prune -a
npm run docker:up:db
```

### Permission Denied (Linux/Mac)

```bash
sudo chown -R $USER:$USER .
```

---

## 🔒 Security Best Practices

1. **Never commit** `.env` or `.env.docker` files to version control
2. **Always update** `.example.env` when adding new environment variables (without sensitive values)
3. **Use strong secrets** for `JWT_SECRET` and `SESSION_SECRET` in production
4. **Rotate credentials** regularly in production environments
5. **Use environment-specific** configurations for dev/staging/production

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ Quick Start Checklist

- [ ] Node.js, Docker, and Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment files configured (`.env` and `.env.docker`)
- [ ] Docker services started (`npm run docker:up:db`)
- [ ] Migrations run (`npm run migration:run`)
- [ ] Database seeded (`npm run seed`)
- [ ] Development server started (`npm run start:dev`)
- [ ] API accessible at `http://localhost:3535`
- [ ] Swagger docs accessible at `http://localhost:3535/api-docs`

---

**Happy Coding! 🎉**

For issues or questions, please open an issue in the repository or contact the development team.
