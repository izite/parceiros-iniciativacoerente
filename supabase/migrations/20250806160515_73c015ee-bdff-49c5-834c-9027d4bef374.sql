-- Primeiro remover as constraints existentes e recriar com o novo valor
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_perfil_check;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_tipo_check;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Recriar as constraints incluindo o valor "administrador"
ALTER TABLE public.users ADD CONSTRAINT users_perfil_check 
CHECK (perfil IN ('backoffice', 'parceiro', 'comercial', 'administrador'));

ALTER TABLE public.users ADD CONSTRAINT users_tipo_check 
CHECK (tipo IN ('backoffice', 'parceiro', 'comercial', 'administrador'));

ALTER TABLE public.users ADD CONSTRAINT users_role_check 
CHECK (role IN ('backoffice', 'parceiro', 'comercial', 'admin'));

-- Criar função para definir automaticamente o perfil baseado no email
CREATE OR REPLACE FUNCTION public.set_user_profile_by_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o email for izite95@gmail.com, definir como administrador
  IF NEW.email = 'izite95@gmail.com' THEN
    NEW.tipo := 'administrador';
    NEW.role := 'admin';
    NEW.perfil := 'administrador';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar triggers para aplicar automaticamente o perfil baseado no email
DROP TRIGGER IF EXISTS set_profile_on_user_insert ON public.users;
DROP TRIGGER IF EXISTS set_profile_on_user_update ON public.users;

CREATE TRIGGER set_profile_on_user_insert
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_profile_by_email();

CREATE TRIGGER set_profile_on_user_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_profile_by_email();

-- Inserir utilizador administrador
INSERT INTO public.users (email, nome, tipo, role, perfil, estado)
VALUES ('izite95@gmail.com', 'Administrador', 'administrador', 'admin', 'administrador', 'Ativo')
ON CONFLICT (email) DO UPDATE SET
  tipo = EXCLUDED.tipo,
  role = EXCLUDED.role,
  perfil = EXCLUDED.perfil;