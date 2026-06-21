# ParentHalo API

Production-ready NestJS 11 backend for ParentHalo, built with Node.js 22, TypeScript, Prisma, PostgreSQL, Docker, and GitHub Actions.

## Stack

- NestJS 11 with modular Clean Architecture folders
- PostgreSQL with Prisma ORM
- ConfigModule with typed environment validation
- DTO validation via `class-validator` and `class-transformer`
- Helmet, CORS, compression, throttling, request logging, and global exception handling
- Winston structured logging
- Swagger/OpenAPI at `/docs`
- Health checks at `/api/v1/health`
- Jest and Supertest
- ESLint, Prettier, Husky, and lint-staged
- Docker and Docker Compose

## Getting Started

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run start:dev
```

The API starts at `http://localhost:3000/api/v1`.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Scripts

```bash
npm run lint
npm test
npm run test:e2e
npm run build
npm run prisma:migrate
```

## Project Structure

```text
src/
  application/         use cases and orchestration
  common/              filters, interceptors, middleware, shared DTOs
  config/              typed configuration and env validation
  domain/              entities, value objects, repository contracts
  infrastructure/      database, logging, external adapters
  modules/             HTTP feature modules
```

## Environment

See `.env.example` for all required variables.
