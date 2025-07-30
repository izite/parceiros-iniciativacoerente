-- Primeiro, remover a foreign key constraint que está a causar o problema
ALTER TABLE contratos DROP CONSTRAINT IF EXISTS contratos_sub_utilizador_fkey;

-- Criar utilizador na tabela users se não existir (baseado no utilizador autenticado)
INSERT INTO users (id, email, nome, tipo, auth_user_id)
SELECT 
  auth.uid(),
  auth.email(),
  COALESCE(auth.email(), 'Utilizador'),
  'comercial',
  auth.uid()
WHERE auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid()
  );

-- Recriar a foreign key constraint para sub_utilizador (agora como nullable)
ALTER TABLE contratos 
ALTER COLUMN sub_utilizador DROP NOT NULL;

-- Recriar a foreign key mas permitindo NULL
ALTER TABLE contratos 
ADD CONSTRAINT contratos_sub_utilizador_fkey 
FOREIGN KEY (sub_utilizador) REFERENCES users(id);