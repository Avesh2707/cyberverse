# OpenLabs (Cyberverse) — Cybersecurity Learning Platform

A full-stack MERN application for learning cybersecurity concepts through structured content and practice questions.

## Repositories

This project is split into two repositories:

- **Backend (this repo):** Node.js/Express API with MongoDB — handles auth, learning content, and practice questions.
- **Frontend:** [cyberverse-frontend](https://github.com/Avesh2707/cyberverse-frontend) — React app that consumes this API.

## Tech Stack

- Node.js, Express
- MongoDB with Mongoose
- JWT-based authentication
- Rate limiting, Helmet, CORS for security

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your own values
npm run dev
```

See `API_DOCS.md` for full endpoint documentation.

## Deployment

- Backend: Render / Railway
- Frontend: Vercel
- Set `CORS_ORIGIN` in this repo's `.env` to your deployed frontend URL, and set `REACT_APP_API_URL` in the frontend's `.env` to this API's deployed URL.
