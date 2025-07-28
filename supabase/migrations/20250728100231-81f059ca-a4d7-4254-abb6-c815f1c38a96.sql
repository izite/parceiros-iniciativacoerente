-- Atualizar emails dos utilizadores de teste para domínios válidos
-- Isto permitirá que sejam registados no Supabase Auth

UPDATE public.users 
SET email = 'admin@backoffice.com'
WHERE email = 'admin@backoffice.test';

UPDATE public.users 
SET email = 'joao@parceiro.com' 
WHERE email = 'joao@parceiro.test';

UPDATE public.users 
SET email = 'maria@comercial.com'
WHERE email = 'maria@comercial.test';

-- Atualizar também na tabela contratos se existirem referências
UPDATE public.contratos 
SET cliente_nome = 'admin@backoffice.com'
WHERE cliente_nome = 'admin@backoffice.test';

UPDATE public.contratos 
SET cliente_nome = 'joao@parceiro.com'
WHERE cliente_nome = 'joao@parceiro.test';

UPDATE public.contratos 
SET cliente_nome = 'maria@comercial.com'
WHERE cliente_nome = 'maria@comercial.test';