-- Criar utilizadores de autenticação no Supabase para coincidir com a tabela users
-- Os emails devem coincidir exatamente com os da tabela public.users

-- Inserir utilizadores de autenticação (isto será feito manualmente no Supabase Auth)
-- Senhas para os utilizadores de teste:
-- backoffice@teste.com: senha123
-- parceiro@teste.com: senha123  
-- comercial@teste.com: senha123

-- Como não podemos inserir diretamente na tabela auth.users via SQL,
-- vamos criar uma função para ajudar na sincronização dos dados

CREATE OR REPLACE FUNCTION sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando um utilizador se autentica pela primeira vez,
  -- sincronizar dados do perfil se existir na tabela users
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users 
    SET auth_user_id = NEW.id 
    WHERE email = NEW.email AND auth_user_id IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para sincronização automática
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_profile();

-- Adicionar coluna auth_user_id se não existir
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);