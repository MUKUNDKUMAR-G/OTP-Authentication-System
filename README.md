# OTP Authentication System

A fullstack web application implementing secure OTP-based authentication with rate limiting, session management, and comprehensive testing. Built as a solution to the Fullstack Developer Challenge focusing on One-Time Password authentication flow.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)

## Overview

This application provides a complete OTP-based authentication system where users can log in using their email or phone number. The system generates a One-Time Password, validates it with rate limiting protection, and issues JWT tokens for session management.

### Key Capabilities

- OTP generation and validation with 5-minute expiration
- Rate limiting: 3 failed attempts trigger a 10-minute block
- JWT-based session management with token persistence
- Auto-creation of user accounts on first login
- Responsive React frontend with form validation
- RESTful API with comprehensive error handling
- Property-based testing for correctness guarantees

## Features

### Core Authentication Flow

1. **Login Page**: User enters email or phone number
2. **OTP Generation**: System generates a 6-digit OTP (logged to console)
3. **Verification Page**: User enters the received OTP
4. **Validation**: System validates OTP and tracks failed attempts
5. **Welcome Page**: Authenticated users see their profile

### Security Features

- Input validation on both frontend and backend
- Rate limiting to prevent brute force attacks
- Automatic blocking after 3 failed attempts (10-minute duration)
- JWT token authentication with 24-hour expiration
- Session persistence across page refreshes
- Protected routes requiring valid authentication

### User Experience

- Real-time form validation with error messages
- Loading indicators during API requests
- Clear feedback for blocked accounts with countdown
- Remaining attempts display
- Seamless session restoration on page refresh

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Login Page  │→ │Verification  │→ │ Welcome Page │      │
│  │              │  │    Page      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    localStorage (token)                      │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
                             │
┌────────────────────────────┴────────────────────────────────┐
│                   Backend API (Node.js/Express)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Authentication Controller                │   │
│  │  • POST /auth/request-otp                            │   │
│  │  • POST /auth/verify-otp                             │   │
│  │  • GET  /auth/me                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer                     │   │
│  │  • OTP Service (Generation & Validation)             │   │
│  │  • Rate Limiter (Attempt Tracking & Blocking)        │   │
│  │  • Token Service (JWT Management)                    │   │
│  │  • User Service (User Management)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Layer (In-Memory)                   │   │
│  │  • Users Map                                         │   │
│  │  • OTPs Map                                          │   │
│  │  • Block List Map                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

**Backend Services:**
- `authController.js` - HTTP request handling and routing
- `otpService.js` - OTP generation, storage, and validation
- `rateLimiter.js` - Failed attempt tracking and blocking logic
- `tokenService.js` - JWT token generation and verification
- `userService.js` - User creation and retrieval
- `validation.js` - Input validation utilities
- `storage.js` - In-memory data storage
- `middleware.js` - Authentication and error handling middleware

**Frontend Components:**
- `LoginPage.jsx` - Email/phone input and OTP request
- `VerificationPage.jsx` - OTP input and validation
- `WelcomePage.jsx` - Authenticated user dashboard
- `ProtectedRoute.jsx` - Route guard for authenticated pages
- `authService.js` - API communication and token management
- `validation.js` - Client-side input validation

## Tech Stack

### Frontend

- **React 18.2** - UI framework with functional components and hooks
- **React Router 6.20** - Client-side routing and navigation
- **Axios 1.6** - HTTP client for API requests
- **Vite 5.0** - Build tool and development server
- **Jest 29.7** - Testing framework
- **fast-check 3.15** - Property-based testing library

### Backend

- **Node.js** - JavaScript runtime (v18+)
- **Express 4.18** - Web framework for REST API
- **jsonwebtoken 9.0** - JWT token generation and verification
- **dotenv 16.3** - Environment variable management
- **cors 2.8** - Cross-origin resource sharing
- **Jest 29.7** - Testing framework
- **fast-check 3.15** - Property-based testing library
- **supertest 7.1** - HTTP assertion library for API testing

### Development Tools

- **ESLint** - Code linting and quality
- **nodemon** - Auto-restart development server
- **Babel** - JavaScript transpilation for tests

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd otp-authentication
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Create backend environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` file with your configuration:
```env
JWT_SECRET=your-secret-key-here-change-in-production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

```

### Using the Application

1. **Login**: Enter a valid email (e.g., `user@example.com`) or phone number (e.g., `+1234567890`)
2. **Check Console**: The generated OTP will be logged in the backend console
3. **Verify**: Enter the 6-digit OTP on the verification page
4. **Access**: Upon successful verification, you'll be redirected to the welcome page

Note: OTPs expire after 5 minutes. You have 3 attempts before being blocked for 10 minutes.

## API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### 1. Request OTP

**POST** `/auth/request-otp`

Generates and returns an OTP for the provided identifier.

**Request Body:**
```json
{
  "identifier": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

**Error Response - Blocked (429):**
```json
{
  "success": false,
  "error": "Too many failed attempts. Please try again later.",
  "blockedUntil": 1701234567890,
  "remainingTime": 456
}
```

**Error Response - Invalid Input (400):**
```json
{
  "success": false,
  "error": "Invalid email or phone number format"
}
```

#### 2. Verify OTP

**POST** `/auth/verify-otp`

Validates the OTP and returns a session token.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "identifier": "user@example.com",
    "createdAt": 1701234567890,
    "lastLogin": 1701234567890
  }
}
```

**Error Response - Invalid OTP (401):**
```json
{
  "success": false,
  "error": "Invalid OTP",
  "attemptsRemaining": 2
}
```

**Error Response - Expired OTP (401):**
```json
{
  "success": false,
  "error": "OTP has expired. Please request a new one."
}
```

#### 3. Get Current User

**GET** `/auth/me`

Returns the authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "identifier": "user@example.com",
    "createdAt": 1701234567890,
    "lastLogin": 1701234567890
  }
}
```

**Error Response - Unauthorized (401):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

#### 4. Health Check

**GET** `/health`

Returns server health status.

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": 1701234567890
}
```

## Design Decisions

### 1. In-Memory Storage

For this MVP, all data (users, OTPs, blocks) is stored in memory using JavaScript Maps. This simplifies deployment and eliminates database dependencies, but data is lost on server restart.

**Rationale:** Focuses on core authentication logic without infrastructure complexity. Suitable for development and demonstration purposes.

### 2. JWT for Session Management

Session tokens are implemented as JWTs containing user identifier and expiration. This allows stateless authentication without server-side session storage.

**Rationale:** Scalable, stateless approach that works well with REST APIs and supports distributed systems.

### 3. 6-Digit Numeric OTPs

OTPs are 6-digit numbers (100000-999999), balancing security with usability.

**Rationale:** Industry standard that provides 1 million possible combinations while being easy to type and remember.

### 4. 5-Minute OTP Expiry

OTPs expire after 5 minutes to balance security and user experience.

**Rationale:** Long enough for users to receive and enter the code, short enough to minimize security risk.

### 5. Mock OTP Delivery

OTPs are logged to the backend console rather than sent via email/SMS.

**Rationale:** Eliminates external service dependencies for this challenge while demonstrating the complete flow.

### 6. Auto-Create Users

Users are automatically created on first OTP request without registration.

**Rationale:** Simplifies the authentication flow and reduces friction for new users.

### 7. Rate Limiting Strategy

3 failed attempts trigger a 10-minute block at the application level.

**Rationale:** Prevents brute force attacks while being forgiving enough for legitimate users who make mistakes.

## Security Considerations

### Implemented Security Measures

1. **Input Validation**: All inputs validated on both frontend and backend
2. **Rate Limiting**: Prevents brute force attacks through attempt tracking
3. **OTP Expiration**: Time-limited OTPs reduce attack window
4. **JWT Tokens**: Signed tokens with expiration claims
5. **Token Transmission**: Tokens sent via Authorization header, not URL
6. **XSS Protection**: React's built-in escaping prevents XSS
7. **CORS Configuration**: Restricted to frontend origin

### Production Recommendations

1. **HTTPS**: Use HTTPS in production to encrypt data in transit
2. **Secret Management**: Store JWT_SECRET in secure vault (not .env file)
3. **Database**: Replace in-memory storage with persistent database
4. **Real OTP Delivery**: Integrate with email/SMS service
5. **Network Rate Limiting**: Add express-rate-limit for DDoS protection
6. **Logging**: Implement audit logging for security events
7. **CORS**: Restrict CORS to specific production domains
8. **Token Rotation**: Implement refresh tokens for extended sessions

