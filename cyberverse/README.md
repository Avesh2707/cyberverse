# 🛡️ OPENLABS API

A production-ready backend for a Cybersecurity Learning Platform similar to TryHackMe / HackTheBox.

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Joi
- **HTTP Client:** Axios (for external APIs)

---

## 📁 Folder Structure

```
OPENLABS/
├── server.js                   # Entry point
├── .env.example                # Environment variable template
├── package.json
├── config/
│   └── db.js                   # MongoDB connection
├── models/
│   ├── User.model.js
│   ├── Domain.model.js
│   ├── Challenge.model.js
│   ├── LearningModule.model.js
│   ├── Submission.model.js
│   └── Leaderboard.model.js
├── controllers/
│   ├── auth.controller.js
│   ├── dashboard.controller.js
│   ├── domain.controller.js
│   ├── challenge.controller.js
│   ├── learn.controller.js
│   ├── practice.controller.js
│   ├── compete.controller.js
│   ├── flag.controller.js
│   ├── leaderboard.controller.js
│   ├── news.controller.js
│   ├── ctf.controller.js
│   ├── admin.controller.js
│   └── user.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── domain.routes.js
│   ├── challenge.routes.js
│   ├── learn.routes.js
│   ├── practice.routes.js
│   ├── compete.routes.js
│   ├── flag.routes.js
│   ├── leaderboard.routes.js
│   ├── news.routes.js
│   ├── ctf.routes.js
│   ├── admin.routes.js
│   └── user.routes.js
├── middleware/
│   ├── auth.middleware.js      # JWT protect + adminOnly
│   ├── validate.middleware.js  # Joi schemas
│   └── error.middleware.js     # asyncHandler + AppError
└── seed/
    └── seed.js                 # Database seeder
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔐 Authentication

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get own profile |
| PUT | `/api/auth/change-password` | Private | Change password |

**Register body:**
```json
{
  "username": "h4x0r",
  "email": "user@example.com",
  "password": "SecurePass1",
  "college_name": "MIT"
}
```

**Login response:**
```json
{
  "success": true,
  "message": "Hi h4x0r 👋",
  "token": "eyJ...",
  "user": { "id": "...", "username": "h4x0r", "college_name": "MIT" }
}
```

---

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard` | Private | Full dashboard data |

**Response includes:** greeting, stats (completedChallenges, totalPoints, rank), all domains.

---

### Domains

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/domains` | Private | List all domains |
| GET | `/api/domains/:slug` | Private | Domain + challenges |

**Query params for `/:slug`:**
- `difficulty=easy\|medium\|hard\|insane`
- `type=learn\|practice\|compete`
- `search=<text>`
- `page=1&limit=20`

---

### Challenges

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/challenges` | Private | Search challenges |
| GET | `/api/challenges/:id` | Private | Single challenge |

---

### Learning

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/learn/:domain` | Private | Modules for domain |
| GET | `/api/learn/module/:id` | Private | Single module |

---

### Practice

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/practice` | Private | Random medium challenges |

**Query params:** `limit`, `domain`

---

### Compete

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/compete` | Private | Competitive challenges |

**Note:** Points earned here affect the leaderboard.

---

### Flag Submission

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/submit-flag` | Private | Submit challenge flag |

**Body:**
```json
{
  "challenge_id": "60f7b1234...",
  "submitted_flag": "CV{your_flag_here}"
}
```

**Success response:**
```json
{
  "success": true,
  "message": "🎉 Correct flag! You earned 150 points!",
  "data": {
    "points_earned": 150,
    "total_points": 425,
    "challenges_solved": 6,
    "new_badges": [{ "name": "Hacker", "icon": "💻" }]
  }
}
```

---

### Leaderboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/leaderboard` | Private | Global rankings |

**Query params:** `page`, `limit`

---

### Live Feeds

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/ctf-news` | Private | Cybersecurity news (NewsAPI) |
| GET | `/api/live-ctfs` | Private | Live CTF events (CTFtime) |

---

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/:username` | Private | Public profile |
| PUT | `/api/users/profile` | Private | Update own profile |
| GET | `/api/users/submissions` | Private | Submission history |
| GET | `/api/users/certificate/:domain_slug` | Private | Generate certificate |

---

### Admin Routes (admin role required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| POST | `/api/admin/domains` | Create domain |
| PUT | `/api/admin/domains/:id` | Update domain |
| DELETE | `/api/admin/domains/:id` | Deactivate domain |
| POST | `/api/admin/challenges` | Create challenge |
| PUT | `/api/admin/challenges/:id` | Update challenge |
| DELETE | `/api/admin/challenges/:id` | Deactivate challenge |
| POST | `/api/admin/modules` | Create learning module |
| PUT | `/api/admin/modules/:id` | Update module |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/toggle` | Activate/deactivate user |

---

## 🔒 Security Features

- **bcrypt** password hashing (salt rounds: 12)
- **JWT** with configurable expiration
- **Helmet** security headers
- **Rate limiting** — 100 req/15min global, 20 req/15min on auth
- **Input validation** via Joi on all POST routes
- **Duplicate flag submission** prevention
- **Role-based access control** (student / admin)
- **Async error handling** — no unhandled promise rejections
- **MongoDB injection** protection via Mongoose

---

## 🏆 Badge System

Badges are automatically awarded based on solve count:

| Badge | Threshold | Icon |
|-------|-----------|------|
| First Blood | 1 challenge | 🩸 |
| Hacker | 10 challenges | 💻 |
| Elite | 25 challenges | ⚡ |
| Legend | 50 challenges | 🏆 |

---

## 📜 Certificate Generation

Users can generate a certificate for any domain where they've solved ≥ 80% of challenges:

```
GET /api/users/certificate/web-security
```

Returns a verifiable certificate object with a unique ID.

---

## 🌐 External APIs

- **NewsAPI** — Set `NEWS_API_KEY` in `.env` ([newsapi.org](https://newsapi.org))
- **CTFtime** — No key required (public API)

Both endpoints gracefully fall back to mock data if APIs are unavailable.

---

## 🧪 Seed Data

Default domains: Web Security, Network Security, Cryptography, Reverse Engineering, Forensics, OSINT, Malware Analysis, Cloud Security, Binary Exploitation

Default accounts after seeding:
- **Admin:** `admin@OPENLABS.io` / `Admin@12345`
- **Student:** `student@example.com` / `Student@123`
