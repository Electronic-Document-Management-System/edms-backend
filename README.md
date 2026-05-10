# EDMS Backend

The core engine of the Electronic Document Management System.

## 🚀 Quick Links
- [Architecture & Design Logic](./docs/architecture.md)
- [API Documentation](./docs/api-spec.md)
- [Database Schema](./docs/database.md)

## 🛠 Tech Stack
- **Node.js** (Runtime) | **TypeScript** (Language)
- **Prisma v7** (ORM) | **PostgreSQL** (Database)

## 🚦 Setup
1. `npm install`
2. Configure `.env` (refer to `.env.example`)
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npm run dev`