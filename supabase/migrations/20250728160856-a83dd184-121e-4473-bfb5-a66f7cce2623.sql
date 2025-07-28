-- Remover a foreign key constraint que está a causar o erro
-- A constraint está a tentar referenciar a tabela users mas queremos usar auth.uid() diretamente

ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_criado_por_fkey;
ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_autor_id_fkey;
ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_sub_utilizador_fkey;

-- Garantir que os campos são UUID e podem aceitar auth.uid()
-- Não precisamos de foreign keys para estes campos pois referenciam auth.users
-- que é uma tabela gerida pelo Supabase