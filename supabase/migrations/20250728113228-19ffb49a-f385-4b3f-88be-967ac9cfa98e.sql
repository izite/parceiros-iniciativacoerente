-- Corrigir as funções para serem mais seguras (definir search_path)

-- Atualizar a função sync_user_profile para ser mais segura
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
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
$$;

-- Atualizar a função handle_new_user para ser mais segura
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Quando um novo utilizador se autentica, procurar na tabela users por email correspondente
  UPDATE public.users 
  SET auth_user_id = NEW.id 
  WHERE email = NEW.email AND auth_user_id IS NULL;
  
  RETURN NEW;
END;
$$;