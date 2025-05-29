# Shield Backend Challenge

This is a backend API developed as part of the Shield technical challenge. It provides secure authentication and wallet management functionality using Express.js, PostgreSQL, Sequelize, JWT, and Swagger documentation.

Core features include:

- JWT-based signup/signin
- CRUD operations for user wallets
- Pagination and input validation
- Fully dockerized environment (PostgreSQL and App)
- Swagger API documentation
- Integration tests with Jest and Supertest

## Tech Stack

- **Node.js + Express.js**
- **PostgreSQL + Sequelize**
- **JWT** for authentication
- **Zod** for input validation
- **Swagger (swagger-jsdoc + swagger-ui-express)** for documentation
- **Docker + Docker Compose**
- **Jest + Supertest** for testing

## Getting Started

### 🖥️ Running Locally (Without Docker)

1. Install dependencies:

```bash
npm install
```

2. Create a .env file based on .env.example:

3. Run the app (the database should be up and running, I recommend at least have the database running in docker for simplicity) 

```bash
npm run dev
```


### 🐳 Running with Docker

1. Build and start the full stack (Postgres, App)

```bash
docker-compose up --build
```

2. App will be available at:
http://localhost:3000
Swagger docs: http://localhost:3000/api-docs

## Postman Collection

A postman collection is available here:
https://github.com/jp93arg/shield-backend-challenge/blob/main/Shield%20API.postman_collection.json

## CI

![Tests](https://github.com/jp93arg/shield-backend-challenge/actions/workflows/test.yml/badge.svg)
