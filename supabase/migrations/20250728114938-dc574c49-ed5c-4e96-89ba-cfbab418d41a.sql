-- Corrigir a ligação dos utilizadores e confirmar email do admin

-- Confirmar o email do admin
UPDATE auth.users 
SET confirmed_at = now(), email_confirmed_at = now()
WHERE email = 'admin@backoffice.com';

-- Atualizar os emails na tabela users para corresponder aos da auth
UPDATE public.users 
SET email = 'admin@backoffice.com',
    auth_user_id = (SELECT id FROM auth.users WHERE email = 'admin@backoffice.com' LIMIT 1)
WHERE email = 'comercial@crm.com';

UPDATE public.users 
SET email = 'izite95@gmail.com',
    auth_user_id = (SELECT id FROM auth.users WHERE email = 'izite95@gmail.com' LIMIT 1)
WHERE email = 'parceiro@crm.com';

-- Verificar a ligação final
SELECT u.email as user_email, u.auth_user_id, au.email as auth_email 
FROM public.users u 
JOIN auth.users au ON u.auth_user_id = au.id;