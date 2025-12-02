# Changelog

All notable changes to Dust & Glory will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Phase 1 Sprint 2 (2025-12-02)

#### Testing Infrastructure
- Added test utilities (`test/test-utils.ts`) with mock repository factory and test data generators
- Created **UsersService** unit tests (7 tests, 100% coverage)
  - Tests for `findOne` method (found, not found, database errors)
  - Tests for `create` method (successful creation, partial data, save errors)
- Created **AuthService** unit tests (11 tests, 100% coverage)
  - Tests for `validateUser` method (valid/invalid credentials, bcrypt errors)
  - Tests for `login` method (token generation)
  - Tests for `register` method (password hashing, user creation, error propagation)
- Created comprehensive E2E test suite (`test/auth.e2e-spec.ts`)
  - 14 test cases covering registration, login, protected routes, and validation
  - Tests written but require configuration fixes for JWT/Auth
- Updated Jest configuration with:
  - Coverage thresholds (global: 50%, critical services: 80%)
  - Coverage collection exclusions (DTOs, entities, modules)
  - Multiple coverage reporters (text, html, lcov)
  - HTML coverage report generation

### Added - Phase 1 Sprint 1 (2025-12-02)

#### Environment Configuration System
- Added `@nestjs/config` package for environment variable management
- Added `joi` package for environment validation
- Created `.env.example` template with comprehensive configuration options
- Created `src/config/configuration.ts` - Type-safe configuration factory supporting:
  - Application settings (port, API prefix, CORS origin, Swagger toggle)
  - Database configuration (SQLite for dev, PostgreSQL for production)
  - JWT authentication settings
- Created `src/config/validation.schema.ts` - Joi validation schema with conditional validation based on database type
- Updated `app.module.ts` to use ConfigModule globally with validation
- Updated TypeORM configuration to dynamically load from environment variables
- Updated `main.ts` to use ConfigService for all application settings
- Configuration automatically prevents `synchronize: true` in production environment

#### Input Validation & Error Handling
- Created `src/auth/dto/login.dto.ts` with validation for:
  - Username (3-50 characters, required)
  - Password (minimum 6 characters, required)
- Created `src/auth/dto/register.dto.ts` with comprehensive validation:
  - Username (3-50 characters, alphanumeric with underscores/hyphens only)
  - Email (valid email format)
  - Password (minimum 6 characters, must contain uppercase, lowercase, and number)
- Added global `ValidationPipe` in main.ts with:
  - Whitelist (strips unknown properties)
  - ForbidNonWhitelisted (rejects requests with unknown properties)
  - Transform (auto-converts types)
- Created `src/common/filters/all-exceptions.filter.ts` - Global exception filter providing:
  - Consistent error response format (statusCode, timestamp, path, method, message)
  - Automatic logging of 5xx errors
  - Graceful handling of all exception types
- Updated `auth.controller.ts` to use typed DTOs instead of `any`
- Updated `auth.service.ts` to use `RegisterDto` type

#### Infrastructure Improvements
- Updated `.gitignore` to allow `.env.example` while blocking actual `.env` files
- Added API prefix configuration (default: `/api`)
- Added configurable CORS origin from environment
- Improved console logging with application URL display on startup

### Changed
- **BREAKING**: Application now requires `.env` file to run (copy from `.env.example`)
- **BREAKING**: All API endpoints now prefixed with `/api` by default
- Password validation now enforces strong passwords (uppercase + lowercase + number)
- Error responses now have consistent format across all endpoints

### Security
- JWT secrets must now be provided via environment variables
- Database credentials externalized to environment variables
- Automatic production-safe defaults (`synchronize: false` in production)
- Input validation prevents malformed requests from reaching business logic

---

## Development Notes

### Migration Instructions
1. Copy `.env.example` to `.env` in the backend directory
2. Update `JWT_SECRET` with a strong random string
3. Configure database settings (SQLite by default, PostgreSQL for production)
4. Run `npm install` to get new dependencies
5. Run `npm run build` to verify compilation
6. Run `npm run start:dev` to start the development server

### Testing Environment Configuration
To test the configuration system:
- Change `PORT` in `.env` to verify dynamic port binding
- Change `API_PREFIX` to test custom API routing
- Remove `JWT_SECRET` to verify validation errors on startup

---

**Version**: 0.1.0 (Phase 1 Sprint 1)  
**Last Updated**: 2025-12-02
