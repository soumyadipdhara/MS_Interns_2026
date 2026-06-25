# WorkSphere — Employee & Task Tracking Platform

A full-stack application for managing employees, assigning tasks, and tracking work progress. Built with **FastAPI** (Python) on the backend and **React + TypeScript + Tailwind CSS** on the frontend.

---

## Features

- **Authentication** — Registration, JWT-based login, role-based access (Admin / User)
- **Employee Management** — Full CRUD, search by name/department, status filter
- **Task Management** — Full CRUD, assign to employees, status updates, filter by status/employee/priority, search
- **Dashboard** — Live stats: employee counts, task breakdown by status, department distribution
- **UI** — Responsive layout, collapsible sidebar, reusable form components, toast notifications, client-side validation

**Role permissions:**
| Action | Admin | User |
|---|---|---|
| View employees & tasks | ✅ | ✅ |
| Add / edit / delete employees | ✅ | ❌ |
| Create / edit / delete tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ |

---

## Project Structure

```
worksphere/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── core/            # Config, security (stdlib-only JWT/hashing), auth dependencies
│   │   ├── db/              # SQLAlchemy engine/session
│   │   ├── models/          # User, Employee, Task ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── routers/         # auth, employees, tasks, dashboard endpoints
│   │   ├── main.py          # App entrypoint
│   │   └── seed.py          # Optional: seeds demo data
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                # React + TypeScript + Tailwind
    ├── src/
    │   ├── components/       # Sidebar, Topbar, Layout, Button, Input, Modal, forms...
    │   ├── pages/            # Login, Register, Dashboard, Employees, Tasks
    │   ├── context/          # AuthContext (global auth state)
    │   ├── services/         # Axios API clients
    │   ├── hooks/            # useDebounce, validation helpers
    │   └── types/            # Shared TypeScript types
    ├── package.json
    └── .env.example
```

---

## Getting Started

### Prerequisites
- Python 3.10 – 3.14
- Node.js 18+
- npm

> **Using Python 3.14?** Make sure `pip` is up to date first (`python -m pip install --upgrade pip`) so it can find the newer wheels these packages ship for 3.14. `requirements.txt` uses minimum-version constraints rather than exact pins for this reason — exact pins on a brand-new Python version can resolve to a release that predates 3.14 wheel support and fail to install.

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt

# Copy environment file (defaults work out of the box for local dev)
cp .env.example .env            # macOS/Linux
copy .env.example .env          # Windows
```

**(Optional but recommended)** Seed the database with a demo admin user, a demo regular user, and sample employees/tasks so you can explore the app immediately:

```bash
python -m app.seed
```

This creates:
- **Admin:** `admin@worksphere.com` / `Admin@123`
- **User:** `user@worksphere.com` / `User@123`

Start the API server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

> If you skip seeding, just register a new account from the app's Register page — selecting "Admin" gives you full management access.

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install

# Copy environment file (defaults point to localhost:8000)
cp .env.example .env            # macOS/Linux
copy .env.example .env          # Windows

npm run dev
```

The app will be live at `http://localhost:5173`.

### 3. Log In

Open `http://localhost:5173` in your browser. Use the seeded demo credentials above, or register a new account.

---

## API Overview

All endpoints are prefixed with `/api`. Full interactive documentation (Swagger UI) is available at `/docs` once the backend is running.

| Module | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Employees | `GET/POST /api/employees`, `GET/PUT/DELETE /api/employees/{id}` |
| Tasks | `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/{id}`, `PATCH /api/tasks/{id}/status` |
| Dashboard | `GET /api/dashboard/stats` |

Employee and task list endpoints support query params for search, filtering, and pagination, e.g.:
```
GET /api/employees?search=priya&status=Active&skip=0&limit=10
GET /api/tasks?status=Pending&employee_id=3&search=report
```

---

## Notes on Design Decisions

- **Database:** SQLite for zero-config local development. The database file lives at an absolute path (`backend/worksphere.db`) regardless of which directory you launch `uvicorn` from — if you ever set a custom `DATABASE_URL` with a relative SQLite path, it's automatically anchored to the `backend/` folder so a different working directory can never silently point you at a different (empty-looking) database. The server prints the exact database path it's using on every startup. To use PostgreSQL instead, just change `DATABASE_URL` in `backend/.env` to a Postgres connection string (e.g. `postgresql://user:pass@localhost/worksphere`) and add `psycopg2-binary` to `requirements.txt`.
- **Auth:** Stateless JWT, 8-hour expiry by default (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`). Tokens are stored in `localStorage` on the frontend.
- **Employee codes:** Auto-generated (`EMP0001`, `EMP0002`, ...) on creation.
- **Deleting an employee** unassigns (rather than deletes) any tasks pointed at them.

---

## Troubleshooting

- **"Network Error" on login/register, but the backend health check works:** This is almost always CORS. The backend only accepts requests from origins it's explicitly told to trust (`localhost:5173`/`127.0.0.1:5173`, `5174`, and `3000` by default). Open the browser console (F12) — a CORS error will say something like *"No 'Access-Control-Allow-Origin' header"*. Make sure you're opening the frontend at one of those exact origins, and check the terminal running `uvicorn` for the line `[WorkSphere] Using database: ...` to confirm the backend actually started without errors.
- **My data disappears after restarting the backend:** This was a known issue caused by a relative database path (`sqlite:///./worksphere.db`) resolving differently depending on which directory `uvicorn` was launched from. It's fixed in this version — the path is always anchored to `backend/worksphere.db`. If you're on an older copy of this project, either delete any stray `worksphere.db` files lying around and re-seed, or pull the updated `app/core/config.py`.
- **CORS errors in the browser console:** Confirm the backend is running on port 8000 and the frontend's `VITE_API_URL` matches it. Also confirm the frontend's URL bar shows an origin from the allow-list above — `localhost` and `127.0.0.1` are treated as different origins by the browser even though they point to the same machine.
- **"Module not found" errors on `npm run dev`:** Run `npm install` again inside `frontend/`.
- **Dependency install issues:** The backend's authentication layer (password hashing + JWT) is implemented using only Python's standard library (`hashlib`, `hmac`, `base64`, `json`) — no `bcrypt`, no `passlib`, no `python-jose`/`PyJWT`. This means there are no compiled C extensions in the auth path that could fail to build or import on a new Python version. If you still see install errors, run `python -m pip install --upgrade pip` first, then re-run `pip install -r requirements.txt`.
- **Login fails with seeded credentials:** Make sure you ran `python -m app.seed` from inside the `backend/` directory with the virtual environment activated.
- **Project folder is inside OneDrive (or another sync client):** OneDrive can lock or delay access to files it's actively syncing — especially the SQLite `.db` file and `node_modules`. If you see intermittent, hard-to-reproduce errors, try moving the project to a plain local path (e.g. `C:\Dev\WorkSphere`) outside any synced folder.
