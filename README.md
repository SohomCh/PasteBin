# PasteBin

# PasteBin Clone

A full-stack PasteBin-style application that allows users to create, manage, and share text snippets securely. The project supports authentication, authorization, public/private pastes, caching, rate limiting, and automatic paste expiration.

## Features

### Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Ownership-Based Authorization
* Rate Limiting

### Paste Management

* Create Paste
* View Paste
* Edit Paste
* Delete Paste
* View All User Pastes
* Public & Private Pastes
* Raw Paste Access
* View Counter

### Performance

* Redis Caching
* Cache Invalidation on Updates
* Automatic Cache Refresh

### Expiry System

* Optional Paste Expiration
* Automatic MongoDB TTL Cleanup

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcrypt

### Caching

* Redis

### Security

* express-rate-limit

### Development Tools

* Git
* GitHub
* Thunder Client

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login user          |
| GET    | `/auth/me`       | Get current user    |

### Pastes

| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| POST   | `/paste`     | Create paste          |
| GET    | `/paste/:id` | Get paste by ID       |
| GET    | `/paste/my`  | Get all user pastes   |
| PATCH  | `/paste/:id` | Update paste          |
| DELETE | `/paste/:id` | Delete paste          |
| GET    | `/raw/:id`   | Get raw paste content |

---

## Architecture

The project follows a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database / Redis
```

This separation keeps business logic independent from request handling and improves maintainability.

---

## Learning Outcomes

This project was built to gain hands-on experience with:

* REST API Design
* Authentication & Authorization
* JWT-Based Security
* MongoDB & Mongoose
* Redis Caching
* Middleware Design
* Rate Limiting
* Cache Invalidation Strategies
* Backend Project Architecture

---

## Future Improvements

* Frontend (React)
* Docker Support
* Deployment
* CI/CD Pipeline
* Swagger/OpenAPI Documentation
* Collaborative Pastes
* Syntax Highlighting
* Search Functionality

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
```

### Run Server

```bash
npm start
```

Server runs on:

```text
http://localhost:8000
```


