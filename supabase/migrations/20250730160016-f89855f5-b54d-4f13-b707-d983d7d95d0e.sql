-- Update the existing user to link with the auth user
UPDATE users 
SET auth_user_id = '2d62bcf5-cf46-40c2-a62c-f7d3bb767532'
WHERE email = 'izite95@gmail.com' AND auth_user_id IS NULL;