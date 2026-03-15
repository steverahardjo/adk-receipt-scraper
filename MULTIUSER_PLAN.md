# Multi-User Architecture Plan

## Overview
Supporting multiple users across **Telegram bot** and **Website** with proper data isolation, authentication, and scalability.

---

## 1. User Identity System

### Problem
- Telegram users identified by `telegram_id` (numeric)
- Website users identified by `email/username` + password
- Need unified identity to share data across platforms

### Solution: Unified User Model

```python
class UserProfile(Document):
    id: str  # Internal UUID
    telegram_id: str | None = None  # Telegram user ID
    email: str | None = None  # Website login
    username: str  # Display name
    created_at: datetime
    platforms: list[str]  # ["telegram", "web"]
```

### User Linking Flow
```
Telegram User:           Website User:
telegram_id: 123456  →   email: user@example.com
                         ↓
                    Same UserProfile (linked)
```

---

## 2. Data Isolation Strategy

### Option A: Shared Database with User Filtering (Recommended)
- All collections have `user_id` field
- Query always filters by `user_id`
- Simpler operations, easier backups

```python
class DocumentArtifact(Document):
    user_id: str  # Required on every document
    title: str
    ...
    
# All queries include user_id
await db.find("documents", filters={"user_id": current_user.id})
```

### Option B: Separate Database Per User
- `expense_tracker_user123`, `expense_tracker_user456`
- Better isolation
- More complex operations

**Recommendation: Option A** - Start with shared DB + filtering. Migrate to per-user DB if needed.

---

## 3. Authentication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  (FastAPI/Express - single backend for both platforms)      │
├─────────────────────────────────────────────────────────────┤
│  Auth Middleware                                             │
│  - Validate Telegram signatures                             │
│  - Validate JWT tokens (website)                            │
│  - Resolve to unified user_id                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  - Business logic                                           │
│  - Always receives authenticated user_id                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  - All queries filtered by user_id                          │
│  - Connection pooling                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Platform-Specific Auth

### Telegram Bot
```python
# Verify update comes from Telegram
async def verify_telegram_update(update: Update) -> str:
    telegram_id = update.effective_user.id
    user = await db.get_user_by_telegram(telegram_id)
    if not user:
        user = await db.create_user(telegram_id=telegram_id)
    return user.id
```

### Website (JWT)
```python
# Login endpoint
@app.post("/login")
async def login(email: str, password: str):
    user = await db.get_user_by_email(email)
    if verify_password(password, user.hashed_password):
        token = create_jwt(user.id)
        return {"access_token": token}

# Middleware
async def auth_middleware(request: Request):
    token = request.headers.get("Authorization")
    payload = verify_jwt(token)
    request.state.user_id = payload["sub"]
```

---

## 5. Database Schema Updates

### Required Changes
```python
# EVERY document needs user_id
class DocumentArtifact(Document):
    user_id: str  # INDEX THIS
    title: str
    ...
    
    class Settings:
        indexes = [
            [("user_id", 1)],  # Query by user
            [("user_id", 1), ("created_at", -1)],  # User's recent docs
        ]
```

### Indexes for Performance
```python
# Add to all collections
[("user_id", 1)]
[("user_id", 1), ("created_at", -1)]
[("user_id", 1), ("document_type", 1)]
```

---

## 6. Session State Management

### Challenge
- Users interact over multiple messages
- Need to track conversation state
- Telegram: long polling / webhooks
- Website: HTTP requests (stateless)

### Solution: Redis for Session State
```python
class SessionStore:
    async def set_state(self, user_id: str, state: dict, ttl: int = 3600):
        await redis.set(f"session:{user_id}", json.dumps(state), ex=ttl)
    
    async def get_state(self, user_id: str) -> dict:
        data = await redis.get(f"session:{user_id}")
        return json.loads(data) if data else None
```

---

## 7. File Storage (GCS) Organization

```
gs://your-bucket/
├── users/
│   ├── {user_id}/
│   │   ├── receipts/
│   │   ├── invoices/
│   │   └── bank_statements/
```

```python
def get_user_storage_path(user_id: str, doc_type: str) -> str:
    return f"users/{user_id}/{doc_type}/{uuid4()}.pdf"
```

---

## 8. Implementation Checklist

### Phase 1: Foundation
- [ ] Add `user_id` to all document models
- [ ] Create user profile collection
- [ ] Update all queries to filter by `user_id`
- [ ] Add database indexes

### Phase 2: Authentication
- [ ] Telegram bot auth (auto-create users)
- [ ] Website JWT auth
- [ ] User linking (telegram ↔ website)
- [ ] Auth middleware

### Phase 3: API Layer
- [ ] Create REST API (FastAPI)
- [ ] Telegram bot uses API
- [ ] Website uses same API
- [ ] Rate limiting

### Phase 4: Polish
- [ ] Redis session storage
- [ ] File organization by user
- [ ] Usage analytics per user
- [ ] Data export per user

---

## 9. Security Considerations

| Concern | Solution |
|---------|----------|
| Data leakage | Always filter by `user_id` |
| Unauthorized access | Auth middleware on all routes |
| Rate limiting | Per-user rate limits |
| File access | Signed URLs, user-scoped paths |
| Input validation | Pydantic models |

---

## 10. Recommended Tech Stack

| Component | Choice |
|-----------|--------|
| Backend API | FastAPI (async, auto-docs) |
| Database | MongoDB (already using) |
| Session Store | Redis |
| File Storage | GCS (already using) |
| Telegram | python-telegram-bot |
| Website Auth | JWT + HTTP-only cookies |
| Deployment | Docker + docker-compose |

---

## Next Steps

1. **Review this plan** - Does it match your requirements?
2. **Start with Phase 1** - Update document models with `user_id`
3. **Build auth middleware** - Single source of truth for user identity
4. **Create API layer** - Both platforms consume same backend
