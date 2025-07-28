-- Garantir que utilizadores autenticados tenham perfis na tabela users
INSERT INTO public.users (
  email, 
  nome, 
  tipo, 
  estado, 
  role, 
  auth_user_id
)
SELECT 
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email) as nome,
  'utilizador' as tipo,  -- Usar valor válido
  'Ativo' as estado,
  'user' as role,
  au.id as auth_user_id
FROM auth.users au
LEFT JOIN public.users u ON u.auth_user_id = au.id
WHERE u.id IS NULL
  AND au.email IS NOT NULL;

-- Criar função para automaticamente criar perfil quando utilizador se autentica
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Verificar se já existe um perfil para este utilizador
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = NEW.id
  ) THEN
    -- Criar perfil automaticamente
    INSERT INTO public.users (
      email, 
      nome, 
      tipo, 
      estado, 
      role, 
      auth_user_id
    ) VALUES (
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      'utilizador',  -- Usar valor válido
      'Ativo',
      'user',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para executar quando utilizador se autentica
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.ensure_user_profile();