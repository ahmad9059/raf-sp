-- Create admin user
-- Password: admin123 (bcrypt hash)
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") 
VALUES (
  'admin-' || substr(md5(random()::text), 1, 8),
  'System Administrator',
  'admin@raf-sp.com',
  '$2b$10$yjKtm3McNJwBrMF31qypde0N1FG5WH5cDv.m5AoLO1YrNKuunn3WW',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Check if admin was created
SELECT id, name, email, role FROM "User" WHERE role = 'ADMIN';