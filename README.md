# Papy
# Papy — Starter App

Stack
- Next.js (pages) + TypeScript
- Tailwind CSS
- Prisma (SQLite for local dev)
- NextAuth (Email + GitHub + Google)
- Simple REST API routes for CRUD

Quick start (local)
1. Copy repo files
2. Install
   npm install
3. Configure
   cp .env.example .env
   (edit .env if needed)
4. Prisma
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
5. Run
   npm run dev
6. Open
   http://localhost:3000

Notes
- For production use change DATABASE_URL to Postgres and configure real OAuth/email credentials.
- To run in Docker: docker-compose up --build
- I can push this scaffold to a GitHub repo for you if you provide owner/repo.

Enjoy — tell me if you want:
- Postgres config and migrations ready
- Vercel / Render deployment config
- Additional features: comments, file uploads, search, admin panel
