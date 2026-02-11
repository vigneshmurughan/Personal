# Auth-enabled Webpage with MongoDB

This project is a simple webpage application built with **Express + EJS**, with:

- User registration and login
- Session-based authorization
- Protected dashboard route
- MongoDB for user data and session store
- Docker and Docker Compose support for deployment

## 1) Prerequisites

### Local run
- Node.js 18+
- MongoDB running locally (or any MongoDB URI)

### Docker run
- Docker
- Docker Compose

## 2) Setup (local)

```bash
npm install
cp .env.example .env
```

Update `.env` with your MongoDB URI and secure session secret.

## 3) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`

## 4) Run with Docker Compose

```bash
docker compose up --build
```

This starts:
- `app` on `http://localhost:3000`
- `mongo` on `mongodb://localhost:27017`

To stop and remove containers:

```bash
docker compose down
```

To stop and remove containers plus database volume:

```bash
docker compose down -v
```

## Environment variables

- `PORT` - HTTP server port
- `NODE_ENV` - `development` or `production`
- `MONGO_URI` - MongoDB connection string
- `SESSION_SECRET` - Session secret
- `MONGO_RETRY_ATTEMPTS` - Mongo connection retries (useful in Docker startup)
- `MONGO_RETRY_DELAY_MS` - Delay between retries in milliseconds

## Health endpoint

- `GET /health` - returns a JSON status payload for container/platform health checks

## Routes

- `GET /login` - Login page
- `GET /register` - Register page
- `GET /dashboard` - Protected page (requires authentication)
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
