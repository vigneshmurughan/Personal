# Auth-enabled Webpage with MongoDB

This project is a simple webpage application built with **Express + EJS**, with:

- User registration and login
- Session-based authorization
- Protected dashboard route
- MongoDB for user data and session store

## 1) Prerequisites

- Node.js 18+
- MongoDB running locally (or any MongoDB URI)

## 2) Setup

```bash
npm install
cp .env.example .env
```

Update `.env` with your MongoDB URI and secure session secret.

## 3) Run

```bash
npm run dev
```

Open `http://localhost:3000`

## Routes

- `GET /login` - Login page
- `GET /register` - Register page
- `GET /dashboard` - Protected page (requires authentication)
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
