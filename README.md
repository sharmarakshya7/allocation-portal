Allocation Portal
---
## Tech Stack

- Frontend: Next.js
- Backend: Node.js, Express
- Deployment: Vercel

## Backend

### API Endpoints
```
GET  /api/health
POST /api/prorate
```

### Run Backend Locally
```
  cd backend
  npm install
  npm run dev
```

Backend runs at:
```
http://localhost:5000
```

After starting the backend, verify it is running by opening:
```
http://localhost:5000/api/health
```

You should receive a JSON response showing the service status.

---

## Frontend

### Run Frontend Locally
```
  cd frontend
  npm install
  npm run dev
```

Frontend runs at:
```
http://localhost:3000
```

---

## Connect Frontend to Backend

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## Test the Application

1. Open the frontend:
   ```
   http://localhost:3000
   ```
2. Fill in the form and submit.
3. The frontend sends a request to:
   ```
   POST /api/prorate
   ```
4. The backend responds with the calculated proration result.
---

