# Athenaeum — Library Management System

A full-stack library management system:

- **Backend:** Quarkus 3.15.1 (Java 20), REST API, JWT auth (SmallRye JWT), BCrypt password
  hashing, Panache/Hibernate ORM, PostgreSQL, Flyway migrations.
- **Frontend:** React 18 (Vite), Tailwind CSS, React Router, Zustand auth store, Axios with
  a request/response interceptor.
- **Database:** PostgreSQL, schema + seed data under `database/`.

```
library-management/
├── backend/            Quarkus REST API (Maven project)
├── frontend/            React + Vite + Tailwind app
├── database/            Standalone PostgreSQL DDL + seed data
└── docker-compose.yml    One-command Postgres for local dev
```

## Prerequisites

- Java 20.0.10, Maven 3.9.16
- Node.js 18+, npm
- PostgreSQL 14+ (or Docker)

## Run everything with Docker Compose (recommended)

This spins up Postgres **and** builds/runs the Quarkus backend in one command —
no local Maven/Java setup needed for the backend.

```bash
docker compose up -d --build
```

- Postgres starts first; the backend waits for it to be healthy before starting
  (see the `healthcheck` / `depends_on` in `docker-compose.yml`).
- The backend image is built from `backend/Dockerfile` (multi-stage: Maven build,
  then a slim JRE runtime).
- Flyway runs automatically inside the container and creates the schema + demo
  accounts on first start.
- API is available at `http://localhost:8080/api`.

Check logs while it starts up:
```bash
docker compose logs -f backend
```

To rebuild after changing backend source code:
```bash
docker compose up -d --build backend
```

To wipe the database and start fresh:
```bash
docker compose down -v
docker compose up -d --build
```

The frontend is **not** containerized in this compose file — run it separately
with `npm run dev` (see below) so you get Vite's hot reload. `VITE_API_BASE_URL`
should point at `http://localhost:8080/api` since the backend port is published
to the host.

---

## Run without Docker for the backend (alternative)

## 1. Start PostgreSQL only

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with database `library_db`, user `library_user`,
password `library_pass` (matches `backend/src/main/resources/application.properties`
defaults). Without Docker, create the same database/user manually and adjust the
`DB_URL` / `DB_USER` / `DB_PASSWORD` environment variables.

## 2. Run the backend

```bash
cd backend
mvn quarkus:dev
```

Flyway runs automatically on startup and creates the schema plus three demo accounts
(password `Password123` for all three):

| Role      | Email                   |
|-----------|-------------------------|
| Admin     | admin@library.com       |
| Librarian | librarian@library.com   |
| User      | user@library.com        |

The API is now available at `http://localhost:8080/api`.

> **Note on JWT keys:** `privateKey.pem` / `publicKey.pem` under
> `backend/src/main/resources` are a generated dev keypair used to sign and verify
> tokens. Generate your own pair for anything beyond local development:
> ```bash
> openssl genrsa -out privateKey.pem 2048
> openssl rsa -in privateKey.pem -pubout -out publicKey.pem
> ```

## 3. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
npm run dev
```

Visit `http://localhost:5173`. Vite's dev server proxies `/api` to `http://localhost:8080`
(see `vite.config.js`), so `VITE_API_BASE_URL` can be left pointing at `/api` in dev,
or at the full backend URL in production.

## API summary

| Endpoint                      | Method | Access                  | Purpose                          |
|--------------------------------|--------|--------------------------|-----------------------------------|
| `/api/auth/register`          | POST   | Public                   | Create an account, returns `{token, data}` |
| `/api/auth/login`             | POST   | Public                   | Authenticate, returns `{token, data}` |
| `/api/books`                  | GET    | Any authenticated user   | List/search books                 |
| `/api/books`                  | POST   | Librarian, Admin         | Create a book                     |
| `/api/books/{id}`             | PUT/DELETE | Librarian, Admin     | Update/delete a book              |
| `/api/borrow`                 | POST   | Any authenticated user   | Borrow a book                     |
| `/api/borrow/{id}/return`     | PUT    | Any authenticated user   | Return a book                     |
| `/api/borrow/history`         | GET    | Any authenticated user   | Caller's own borrow history       |
| `/api/borrow/active`          | GET    | Librarian, Admin         | All active loans                  |
| `/api/profile`                | GET/PUT | Any authenticated user  | View/update own profile           |
| `/api/users`                  | GET    | Admin                    | List all users                    |
| `/api/users/{id}`             | PUT/DELETE | Admin                | Change role/status, delete user   |

Every protected endpoint expects `Authorization: Bearer <token>`.

## Role permissions

| Feature                     | User | Librarian | Admin |
|------------------------------|:----:|:---------:|:-----:|
| Register / log in            | ✅   | ✅        | ✅    |
| Browse catalog, borrow/return | ✅   | ✅        | ✅    |
| View own borrow history       | ✅   | ✅        | ✅    |
| Manage own profile            | ✅   | ✅        | ✅    |
| Manage books (CRUD)           | ❌   | ✅        | ✅    |
| Manage users (roles, delete)  | ❌   | ❌        | ✅    |

## Production build

```bash
# Backend
cd backend && mvn clean package
java -jar target/quarkus-app/quarkus-run.jar

# Frontend
cd frontend && npm run build   # outputs static assets to dist/
```
