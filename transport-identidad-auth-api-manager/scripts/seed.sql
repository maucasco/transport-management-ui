-- Seed data para desarrollo local — TMAGE-2
-- Contraseña para todos los usuarios: admin123
-- Hash: bcrypt con 12 rounds

BEGIN;

INSERT INTO companies (id, name, is_active)
VALUES ('11111111-1111-1111-1111-111111111111', 'Empresa Demo', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, company_id, email, password_hash, role, first_name, last_name, is_active)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'admin@empresa.com',
    '$2b$12$TOZukTJSybm7zRB1nXI7jeYtb5s0lYpt1cVgg1JqF5hv/6IUJvIJ2',
    'admin',
    'Carlos',
    'López',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'conductor@empresa.com',
    '$2b$12$TOZukTJSybm7zRB1nXI7jeYtb5s0lYpt1cVgg1JqF5hv/6IUJvIJ2',
    'conductor',
    'Juan',
    'Pérez',
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'inactive@empresa.com',
    '$2b$12$TOZukTJSybm7zRB1nXI7jeYtb5s0lYpt1cVgg1JqF5hv/6IUJvIJ2',
    'conductor',
    'Ana',
    'García',
    false
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
