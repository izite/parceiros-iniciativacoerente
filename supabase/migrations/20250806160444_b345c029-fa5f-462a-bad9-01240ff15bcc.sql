-- Adicionar o novo nível de permissão "administrador"
-- Atualizar a estrutura para suportar o perfil administrador

-- Primeiro, vamos criar uma função para definir automaticamente o perfil baseado no email
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

-- Criar trigger para aplicar automaticamente o perfil baseado no email
CREATE TRIGGER set_profile_on_user_insert
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_profile_by_email();

CREATE TRIGGER set_profile_on_user_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_profile_by_email();

-- Inserir um utilizador administrador de exemplo se não existir
INSERT INTO public.users (email, nome, tipo, role, perfil, estado)
VALUES ('izite95@gmail.com', 'Administrador', 'administrador', 'admin', 'administrador', 'Ativo')
ON CONFLICT (email) DO UPDATE SET
  tipo = EXCLUDED.tipo,
  role = EXCLUDED.role,
  perfil = EXCLUDED.perfil;