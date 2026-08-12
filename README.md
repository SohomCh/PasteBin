# PasteVault

A full-stack paste management platform for securely creating, managing, and sharing text snippets. PasteVault combines JWT-based authentication, Redis caching, paste expiration, rate limiting, and an AI-powered assistant for explaining, summarizing, improving, debugging, and optimizing pasted content.

**Live Demo:** https://paste-vault-taupe.vercel.app/

**Backend API:** https://pastebin-psmm.onrender.com

---

## Features

### Authentication & Security

* User registration and login
* JWT-based authentication
* Protected API routes
* Ownership-based authorization
* Password hashing with bcrypt
* API rate limiting
* Public and private pastes
* Environment-based configuration for sensitive credentials

### Paste Management

* Create pastes
* View pastes
* Edit pastes
* Delete pastes
* View all user pastes
* Public and private visibility
* Raw paste content access
* View counter
* Optional paste expiration
* Automatic expiration using MongoDB TTL indexes

### Redis Caching

PasteVault uses Redis to reduce repeated database reads for frequently accessed pastes.

* Redis-based paste caching
* Cache lookup before database access
* Cache invalidation when paste data changes
* Automatic cache expiration

### AI Assistant

PasteVault includes an AI-powered assistant that can analyze the content of a paste.

Available actions:

* 🧠 Explain
* 📝 Summarize
* ✨ Improve Writing
* 🐞 Debug Code
* ⚡ Optimize Code

The frontend sends the selected action and paste content to the backend, which handles the AI request and returns the generated response.

AI responses support Markdown rendering for improved readability.

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* React Markdown
* remark-gfm

### Backend

* Node.js
* Express.js
* REST APIs
* Middleware-based architecture

### Database

* MongoDB Atlas
* Mongoose

### Caching

* Redis Cloud
* Redis client for Node.js

### Authentication & Security

* JWT
* bcrypt
* express-rate-limit
* CORS

### AI

* Groq API

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* Redis Cloud — Cache

### Development

* Git
* GitHub
* Thunder Client
* npm

---

## Architecture

PasteVault follows a layered backend architecture that separates HTTP handling from application logic and data access.

```text
                         User
                           │
                           ▼
                  React / Vite Frontend
                           │
                           │ HTTPS
                           ▼
                    Render Backend
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
                 Express       Middleware
                    │
             ┌──────┴───────┐
             │              │
             ▼              ▼
        Controllers      Services
             │              │
             └──────┬───────┘
                    │
             ┌──────┴───────┐
             │              │
             ▼              ▼
        MongoDB Atlas    Redis Cloud
             │
             │
             ▼
       Paste Data / Users

                    │
                    ▼
               Groq API
              AI Assistant
```

### Backend Request Flow

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Redis / MongoDB / External API
   ↓
Response
```

This separation keeps request handling, business logic, and data access easier to maintain and extend.

---

## Redis Caching Flow

For frequently accessed pastes, the backend first checks Redis before querying MongoDB.

```text
GET /paste/:id
       │
       ▼
   Redis GET
       │
   ┌───┴────┐
   │        │
  HIT     MISS
   │        │
   │        ▼
   │     MongoDB
   │        │
   │        ▼
   │     Redis SET
   │        │
   └───┬────┘
       ▼
    Response
```

When a paste is modified or deleted, the corresponding cached data is invalidated to prevent stale results.

---

## Authentication Flow

PasteVault uses JWT-based authentication for protected resources.

```text
User Login
    ↓
Credentials Verified
    ↓
JWT Generated
    ↓
Client Stores Token
    ↓
Authorization Header
    ↓
Authentication Middleware
    ↓
Protected Controller
```

Protected requests use the JWT through the `Authorization` header.

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register a new user            |
| POST   | `/auth/login`    | Login user                     |
| GET    | `/auth/me`       | Get current authenticated user |

### Pastes

| Method | Endpoint     | Description                         |
| ------ | ------------ | ----------------------------------- |
| POST   | `/paste`     | Create a paste                      |
| GET    | `/paste/:id` | Get a paste by ID                   |
| GET    | `/paste/my`  | Get the authenticated user's pastes |
| PATCH  | `/paste/:id` | Update a paste                      |
| DELETE | `/paste/:id` | Delete a paste                      |
| GET    | `/raw/:id`   | Get raw paste content               |

### AI

| Method | Endpoint   | Description                                        |
| ------ | ---------- | -------------------------------------------------- |
| POST   | `/ai/chat` | Process paste content using the selected AI action |

Supported AI actions:

```text
explain
summarize
improve
debug
optimize
```

---

## Production Architecture

PasteVault is deployed as separate frontend and backend services.

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │     Vercel      │
              │ React Frontend  │
              └────────┬────────┘
                       │
                    HTTPS
                       │
                       ▼
              ┌─────────────────┐
              │     Render      │
              │ Node + Express  │
              └───────┬─────────┘
                      │
             ┌────────┴─────────┐
             ▼                  ▼
      ┌──────────────┐   ┌──────────────┐
      │ MongoDB Atlas│   │ Redis Cloud  │
      └──────────────┘   └──────────────┘
```

Production configuration uses environment variables instead of hardcoding database credentials, JWT secrets, Redis credentials, and AI API keys.

---

## Project Structure

```text
PasteVault/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── app.js
│   └── package.json
│
└── README.md
```

---

## Environment Variables

### Backend

Create a `.env` file inside the backend:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
```

### Frontend

For local development:

```env
VITE_API_URL=http://localhost:8000
```

For production, the Vercel environment is configured with:

```env
VITE_API_URL=https://pastebin-psmm.onrender.com
```

**Never commit `.env` files or secret credentials to GitHub.**

---

## Getting Started

### Clone the Repository

```bash
git clone <your-repository-url>
cd PasteVault
```

### Backend

```bash
cd backend
npm install
npm start
```

The backend runs locally on:

```text
http://localhost:8000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

## Deployment

### Frontend

The React/Vite frontend is deployed using **Vercel**.

### Backend

The Node.js/Express backend is deployed using **Render**.

### Database

Production data is stored in **MongoDB Atlas**.

### Cache

Production Redis caching is provided through **Redis Cloud**.

---

## Learning Outcomes

This project provided hands-on experience with:

* REST API design
* Layered backend architecture
* JWT authentication
* Authorization middleware
* MongoDB and Mongoose
* Redis caching
* Cache invalidation
* Rate limiting
* MongoDB TTL indexes
* React frontend development
* API integration with Axios
* AI API integration
* Markdown rendering
* Environment-based configuration
* CORS
* Production deployment
* Cloud database configuration
* Git and GitHub workflows

---

## Future Improvements

Potential future improvements include:

* Automated unit and integration testing
* API documentation with OpenAPI/Swagger
* CI/CD using GitHub Actions
* Dockerized development and deployment
* Improved monitoring and structured logging
* Search and filtering for pastes
* Syntax highlighting for code pastes
* Collaborative/shared editing
* More advanced AI-powered code analysis
* PostgreSQL-based relational data layer for future experimentation

---

## Author

**Sohom Chatterjee**

GitHub: [SohomCh](https://github.com/SohomCh)

---

## License

This project is built for educational and portfolio purposes.
