-- ============================================================
-- Library Management System - Initial schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255)        NOT NULL,
    email       VARCHAR(255)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    role        VARCHAR(20)         NOT NULL DEFAULT 'USER'
                    CHECK (role IN ('USER', 'LIBRARIAN', 'ADMIN')),
    is_active   BOOLEAN             NOT NULL DEFAULT TRUE
);

CREATE TABLE books (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(500)  NOT NULL,
    author              VARCHAR(255)  NOT NULL,
    cover_image         TEXT,
    available_copies    INTEGER       NOT NULL DEFAULT 0 CHECK (available_copies >= 0)
);

CREATE TABLE borrow_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id         UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'BORROWED'
                        CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')),
    borrow_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date        DATE NOT NULL,
    return_date     DATE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_borrow_records_user_id ON borrow_records(user_id);
CREATE INDEX idx_borrow_records_book_id ON borrow_records(book_id);
CREATE INDEX idx_borrow_records_status ON borrow_records(status);
