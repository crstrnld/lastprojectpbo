-- ============================================================
-- Seed data for local development / demo purposes
-- Password for all seeded accounts is: Password123
-- BCrypt hash generated with cost factor 12
-- ============================================================

INSERT INTO users (name, email, password, role, is_active) VALUES
    ('System Admin',   'admin@library.com',     '$2b$12$SdWZrPFdbM/xQ8.up6yeq.TnNTYzt.1K6atC02DTPV/.Fwa5rdtKO', 'ADMIN',     TRUE),
    ('Lena Librarian', 'librarian@library.com', '$2b$12$SdWZrPFdbM/xQ8.up6yeq.TnNTYzt.1K6atC02DTPV/.Fwa5rdtKO', 'LIBRARIAN', TRUE),
    ('Uma User',       'user@library.com',      '$2b$12$SdWZrPFdbM/xQ8.up6yeq.TnNTYzt.1K6atC02DTPV/.Fwa5rdtKO', 'USER',      TRUE);

INSERT INTO books (title, author, cover_image, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', 'https://covers.openlibrary.org/b/isbn/0132350882-L.jpg', 4),
    ('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 'https://covers.openlibrary.org/b/isbn/020161622X-L.jpg', 3),
    ('Design Patterns', 'Erich Gamma et al.', 'https://covers.openlibrary.org/b/isbn/0201633612-L.jpg', 2),
    ('Effective Java', 'Joshua Bloch', 'https://covers.openlibrary.org/b/isbn/0134685997-L.jpg', 5),
    ('Domain-Driven Design', 'Eric Evans', 'https://covers.openlibrary.org/b/isbn/0321125215-L.jpg', 1);
