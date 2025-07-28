-- Atualizar utilizadores para sincronizar com auth.users
-- Primeiro vou buscar os IDs dos auth users e fazer a ligação

-- Para o utilizador parceiro@crm.com
UPDATE public.users 
SET auth_user_id = (
  SELECT id FROM auth.users WHERE email = 'parceiro@crm.com' LIMIT 1
)
WHERE email = 'parceiro@crm.com';

-- Para o utilizador comercial@crm.com  
UPDATE public.users 
SET auth_user_id = (
  SELECT id FROM auth.users WHERE email = 'comercial@crm.com' LIMIT 1
)
WHERE email = 'comercial@crm.com';

-- Criar uma função para automatizar esta sincronização no futuro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Quando um novo utilizador se autentica, procurar na tabela users por email correspondente
  UPDATE public.users 
  SET auth_user_id = NEW.id 
  WHERE email = NEW.email AND auth_user_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para automatizar a sincronização
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();