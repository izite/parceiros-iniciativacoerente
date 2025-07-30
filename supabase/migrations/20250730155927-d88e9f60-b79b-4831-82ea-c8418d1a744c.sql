-- Insert or update the user in the users table first
INSERT INTO users (
  id, 
  email, 
  nome, 
  tipo, 
  auth_user_id,
  estado
)
VALUES (
  '2d62bcf5-cf46-40c2-a62c-f7d3bb767532',
  'izite95@gmail.com',
  'izite95@gmail.com',
  'comercial',
  '2d62bcf5-cf46-40c2-a62c-f7d3bb767532',
  'Ativo'
)
ON CONFLICT (id) DO UPDATE SET
  auth_user_id = EXCLUDED.auth_user_id,
  email = EXCLUDED.email;

-- Also check if there's a user with this email but different id
UPDATE users 
SET auth_user_id = '2d62bcf5-cf46-40c2-a62c-f7d3bb767532'
WHERE email = 'izite95@gmail.com' AND auth_user_id IS NULL;