# Database Design

## Models
1. **User:** Base identity model.
2. **Role:** Access control levels.

## Key Decisions
- **Prisma 7:** Connection configuration `prisma.config.ts` aur `db.config.ts` ke zariye handle ki gayi hai.
- **Migrations:** Version control for database changes is maintained via Prisma Migrate.