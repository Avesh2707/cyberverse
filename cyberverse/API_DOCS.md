# OPENLABS API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 AUTH

### POST /api/auth/register
Register a new user.

**Body:**
```json
{
  "username": "h4cker_pro",
  "email": "user@example.com",
  "password": "Pass@1234",
  "college_name": "IIT Delhi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome to OPENLABS, h4cker_pro!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc...",
    "username": "h4cker_pro",
    "college_name": "IIT Delhi",
    "role": "student"
  }
}
```

---

### POST /api/auth/login
Login and get a token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Pass@1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hi h4cker_pro",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc...",
    "username": "h4cker_pro",
    "college_name": "IIT Delhi",
    "role": "student"
  }
}
```

---

### GET /api/auth/me ⚡ Protected
Get the current logged-in user's profile.

---

## 📊 DASHBOARD

### GET /api/dashboard ⚡ Protected
Get user dashboard with stats and available domains.

**Response:**
```json
{
  "success": true,
  "message": "Hi h4cker_pro",
  "greeting": "Hi h4cker_pro",
  "stats": {
    "completedChallenges": 5,
    "totalPoints": 420,
    "rank": 3
  },
  "domains": [
    {
      "_id": "64abc...",
      "name": "Web Security",
      "slug": "web-security",
      "description": "SQL injection, XSS, CSRF...",
      "difficulty_level": "beginner",
      "total_challenges": 15,
      "icon": "🌐"
    }
  ]
}
```

---

## 🌍 DOMAINS

### GET /api/domains ⚡ Protected
Get all available domains.

### GET /api/domains/:slug ⚡ Protected
Get a specific domain and its challenges.

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)
- `difficulty` - easy | medium | hard | insane
- `type` - learn | practice | compete
- `search` - text search

**Example:** `GET /api/domains/web-security?difficulty=easy&page=1`

---

## 🏋️ PRACTICE

### GET /api/challenges/practice ⚡ Protected
Returns random practice challenges (easy/medium difficulty).

**Query Params:**
- `limit` (default: 10, max: 20)

---

## ⚔️ COMPETE

### GET /api/challenges/compete ⚡ Protected
Returns advanced challenges (hard/insane) that affect the leaderboard.

**Query Params:**
- `page`, `limit`

---

## 📚 LEARN

### GET /api/learn/:domain ⚡ Protected
Get all learning modules for a domain.

**Example:** `GET /api/learn/web-security`

**Response:**
```json
{
  "success": true,
  "domain": { "name": "Web Security", "slug": "web-security" },
  "count": 3,
  "modules": [
    {
      "_id": "64abc...",
      "title": "Introduction to Web Security",
      "content_markdown": "# Web Security...",
      "video_url": "https://youtube.com/...",
      "resources_links": [...],
      "order": 1,
      "duration_minutes": 30
    }
  ]
}
```

### GET /api/learn/:domain/:moduleId ⚡ Protected
Get a specific learning module.

---

## 🚩 FLAG SUBMISSION

### POST /api/submit-flag ⚡ Protected
Submit a flag for a challenge.

**Body:**
```json
{
  "challenge_id": "64abc123...",
  "submitted_flag": "CVF{your_flag_here}"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "🎉 Correct flag! Points awarded.",
  "points_awarded": 150,
  "new_total_points": 570,
  "new_badges": [
    {
      "name": "Script Kiddie",
      "description": "Earned 500 points",
      "icon": "🔵"
    }
  ]
}
```

**Wrong Flag Response:**
```json
{
  "success": false,
  "message": "Wrong flag! Keep trying."
}
```

**Already Solved:**
```json
{
  "success": false,
  "message": "You have already solved this challenge!"
}
```

---

## 📋 SUBMISSIONS

### GET /api/submissions ⚡ Protected
Get your personal submission history.

---

## 🏆 LEADERBOARD

### GET /api/leaderboard ⚡ Protected
Get the global leaderboard sorted by points.

**Query Params:** `page`, `limit`

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "username": "OPENLABS_admin",
      "college_name": "OPENLABS HQ",
      "total_points": 9999,
      "challenges_solved": 50
    }
  ],
  "my_rank": 3,
  "pagination": { "total": 150, "page": 1, "limit": 10 }
}
```

---

## 📰 CTF NEWS

### GET /api/ctf-news ⚡ Protected
Fetch live cybersecurity news (requires NewsAPI key in .env).

**Response:**
```json
{
  "success": true,
  "count": 20,
  "articles": [
    {
      "title": "Critical RCE Found in Apache...",
      "description": "...",
      "source": "The Hacker News",
      "url": "https://...",
      "published_date": "2024-01-15T10:00:00Z",
      "image": "https://..."
    }
  ]
}
```

---

## 🎯 LIVE CTF EVENTS

### GET /api/live-ctfs ⚡ Protected
Fetch upcoming CTF competitions from CTFtime.org.

**Response:**
```json
{
  "success": true,
  "count": 8,
  "events": [
    {
      "event_name": "PicoCTF 2024",
      "start_date": "2024-03-01T00:00:00Z",
      "end_date": "2024-03-15T00:00:00Z",
      "format": "Jeopardy",
      "location": "Online",
      "link": "https://picoctf.org",
      "weight": 52.7,
      "organizer": "CMU"
    }
  ]
}
```

---

## 🔍 SEARCH

### GET /api/challenges/search ⚡ Protected
Search across all challenges.

**Query Params:**
- `q` (required) - search query
- `difficulty` - filter by difficulty
- `type` - filter by type

**Example:** `GET /api/challenges/search?q=sql+injection&difficulty=easy`

---

## 👤 CHALLENGES

### GET /api/challenges/:id ⚡ Protected
Get a specific challenge by ID (flag excluded).

---

## 🛡️ ADMIN ROUTES

All admin routes require `role: "admin"`.

### GET /api/admin/stats
Get platform-wide statistics.

### GET /api/admin/users
Get all users (paginated).

### PATCH /api/admin/users/:id/toggle
Activate or deactivate a user account.

### POST /api/admin/challenges
Create a new challenge.

**Body:**
```json
{
  "title": "New Challenge",
  "description": "Exploit the vulnerability...",
  "difficulty": "medium",
  "points": 100,
  "type": "practice",
  "domain_id": "64abc...",
  "flag": "CVF{the_real_flag}",
  "hints": ["Hint 1", "Hint 2"],
  "tags": ["web", "sqli"]
}
```

### PUT /api/admin/challenges/:id
Update a challenge.

### DELETE /api/admin/challenges/:id
Soft-delete a challenge.

### POST /api/admin/modules
Create a learning module.

### PUT /api/admin/modules/:id
Update a learning module.

### POST /api/admin/domains
Create a new domain.

### PUT /api/admin/domains/:id
Update a domain.

---

## ❌ Error Responses

All errors follow this structure:
```json
{
  "success": false,
  "message": "Description of the error"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource Not Found |
| 409 | Conflict (duplicate) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## 🚀 Quick Start

```bash
# 1. Clone and install
cd OPENLABS
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets

# 3. Seed the database
npm run seed

# 4. Start the server
npm run dev   # development (with nodemon)
npm start     # production

# 5. Test health
curl http://localhost:5000/health
```

---

## 📁 Project Structure

```
OPENLABS/
├── server.js              # App entry point
├── package.json
├── .env.example
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js
│   ├── Domain.js
│   ├── Challenge.js
│   ├── LearningModule.js
│   ├── Submission.js
│   └── Leaderboard.js
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── domainController.js
│   ├── challengeController.js
│   ├── submissionController.js
│   ├── learnController.js
│   ├── leaderboardController.js
│   ├── newsController.js
│   └── adminController.js
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── domains.js
│   ├── challenges.js
│   ├── submissions.js
│   ├── learn.js
│   ├── leaderboard.js
│   ├── news.js
│   └── admin.js
├── middleware/
│   ├── auth.js            # JWT protect + adminOnly
│   ├── rateLimiter.js     # express-rate-limit
│   ├── validator.js       # express-validator rules
│   └── errorHandler.js    # Global error handler
├── utils/
│   ├── jwt.js             # Token generate/verify
│   └── response.js        # Standardized responses
└── seed/
    └── index.js           # Database seeder
```

---

## 🔒 Security Features

- **bcrypt** password hashing (salt rounds: 12)
- **JWT** with expiration (default 7d)
- **Helmet** security headers
- **CORS** configured
- **Rate limiting** (100 req/15min global, 10 req/15min auth, 10 req/min flags)
- **Input validation** on all POST/PUT routes
- **Duplicate flag prevention** (one correct submission per user per challenge)
- **Admin role guard** on all administrative routes
- **Soft deletes** for challenges
- **Flags never returned** in GET endpoints (select: false)
