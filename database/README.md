# Database Setup

This folder contains the raw PostgreSQL DDL for the Library Management System.
Flyway applies these same scripts automatically when the backend starts
(see `backend/src/main/resources/db/migration`), so manual application is
only needed if you want to inspect or run the schema independently.

## Manual setup

```bash
createdb library_db
createuser library_user --pwprompt   # set password to match DB_PASSWORD

psql -d library_db -f schema.sql
psql -d library_db -f seed_data.sql   # optional demo data
```

## Seeded demo accounts (password: `Password123`)

| Role      | Email                   |
|-----------|-------------------------|
| Admin     | admin@library.com       |
| Librarian | librarian@library.com   |
| User      | user@library.com        |
