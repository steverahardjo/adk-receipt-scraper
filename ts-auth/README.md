# Authentication Service

This is an authentication service built using **TypeScript**, **PostgreSQL**, and **Better-auth**.
The service is responsible for handling user identity, authentication, and secure token issuance for backend services implemented in Go.

The goal is to separate **identity management** from **business logic APIs**, allowing backend services to remain language-agnostic and scalable.

---

# Architecture Overview

The authentication service operates as a centralized **identity provider**.

```
Frontend
   ↓
Authentication Service (TypeScript)
   ↓
JWT issued to client
   ↓
Frontend calls Go Backend APIs
   ↓
Go services verify JWT locally
   ↓
Business logic execution
```

Backend services do **not handle authentication logic** directly.
They only **verify and extract claims from JWT tokens**.

---

# Core Features

### User Signup

Handles secure user registration.

* Accepts user information:

  * name
  * email
  * encrypted password
* Stores user credentials securely in PostgreSQL
* Synchronizes user identity with Go backend services

---

### User Login

Handles authentication and identity verification.

* Validates credentials
* Triggers OTP generation
* Confirms OTP validation
* Issues authentication tokens

---

### JWT Token Generation

Generates signed **JSON Web Tokens (JWT)** used for authorization across backend services.

The token is issued to the frontend and sent with every API request.

```
Authorization: Bearer <JWT>
```

All Go services verify the JWT locally without needing to call the authentication service.

---

### Access Control

JWT tokens contain identity claims used by backend services.

Claims ensure:

* correct **user identity**
* **service access permissions**
* **token expiration validation**

---

# Additional Security Features

### Refresh Token Mechanism

Two tokens are issued during login:

```
Access Token  → short lived (e.g. 15 minutes)
Refresh Token → long lived (e.g. 7 days)
```

Flow:

```
User login
   ↓
Auth service issues tokens
   ↓
Access token expires
   ↓
Client requests refresh
   ↓
New access token issued
```

This avoids forcing users to log in repeatedly.

---

### OTP Verification

One-time passwords are used during login verification.

Security rules:

* OTP expiration window
* single-use tokens
* attempt limits
* hashed storage in database

---

### Session Management

Active sessions are tracked to allow token revocation.

Example scenarios:

* user logout
* compromised account
* administrator session revocation

---

### Rate Limiting

Authentication endpoints are protected against abuse.

Examples:

* login attempt limits
* OTP request throttling
* signup rate limits

---

### Audit Logging

Sensitive authentication actions are recorded.

Examples:

* successful login
* failed login attempts
* password reset
* token refresh
* OTP validation

Audit logs allow security monitoring and debugging.

---

# JWT Claims Structure

Tokens include the following standard fields:

| Claim | Purpose               |
| ----- | --------------------- |
| `sub` | user identifier       |
| `exp` | token expiration time |
| `iss` | token issuer          |
| `aud` | target audience       |
| `iat` | token issued time     |

Example payload:

```json
{
  "sub": "user_129",
  "iss": "auth-service",
  "aud": "backend-services",
  "exp": 1712345678,
  "iat": 1712340000
}
```

---

# Tech Stack

* **TypeScript**
* **Bun Runtime**
* **Better-auth**
* **PostgreSQL**

---

# Core Database Entities

Typical authentication tables:

### Users

```
users
- id
- name
- email
- password_hash
- email_verified
- created_at
```

---

### Sessions

```
sessions
- id
- user_id
- refresh_token_hash
- created_at
- expires_at
```

---

### OTP Codes

```
otp_codes
- id
- user_id
- otp_hash
- expires_at
- attempts
```

---

### Audit Logs

```
auth_audit_logs
- id
- user_id
- action
- ip_address
- created_at
```

---

# Data Flow

### Signup

```
Frontend
   ↓
Auth Service
   ↓
Store user credentials
   ↓
Return authentication token
```

---

### Login

```
Frontend login request
   ↓
Auth Service verifies credentials
   ↓
OTP generated and validated
   ↓
JWT access + refresh tokens issued
```

---

### API Request

```
Frontend request
   ↓
Authorization: Bearer <JWT>
   ↓
Go Backend Service
   ↓
JWT verification
   ↓
Extract user identity
   ↓
Process request
```

---

# Security Model

* Stateless authentication using JWT
* Backend services perform **local verification**
* No direct authentication logic inside Go services
* Centralized identity management

This design improves scalability and simplifies backend service development.

---
