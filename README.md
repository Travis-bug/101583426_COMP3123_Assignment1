# COMP 3123 Assignment 1 – Backend API

Secure REST API built with Node.js, Express and MongoDB (Mongoose). Users sign up and log in with JWT, and each user can only manage the employees they created.

> Work in progress. Full documentation (API, auth, security, logging, testing) is added as features land.

## Project structure

```
src/
  config/        env loading and MongoDB connection
  routes/        Express routers (mounted under /api/v1)
  controllers/   request handlers
  models/        Mongoose schemas
  middleware/    auth, validation, error handling
  services/      business logic
  validators/    request validation rules
  utils/         logger, ApiError
  app.js         Express app (middleware + routes)
  server.js      entry point: connect DB, start server
logs/            local log files (git-ignored)
postman/         exported Postman collection
```

## Setup

1. `git clone <repo-url> && cd <repo>`
2. `npm install`
3. `cp .env.example .env` and set `MONGODB_URI` and `JWT_SECRET`
4. Start MongoDB (local `mongod`, or use an Atlas URI)
5. `npm run dev` (auto-reload) or `npm start`
6. Check `GET http://localhost:3000/health`

The database name is always `comp3123_assignment1`.

## Health check

`GET /health` returns `200` with `"status": "ok"` when the API and database are up, or `503` with `"status": "degraded"` when the database is unreachable.
