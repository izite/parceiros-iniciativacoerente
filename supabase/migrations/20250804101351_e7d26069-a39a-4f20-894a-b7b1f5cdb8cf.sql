-- Inserir utilizador com perfil backoffice
INSERT INTO public.users (
  email, 
  nome, 
  tipo, 
  perfil, 
  role, 
  estado
) VALUES (
  'testes@ic.pt', 
  'Teste Backoffice', 
  'utilizador', 
  'backoffice', 
  'backoffice', 
  'Ativo'
);