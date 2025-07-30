-- Remover a foreign key constraint do autor_id que está a causar problema
ALTER TABLE contratos DROP CONSTRAINT IF EXISTS contratos_autor_id_fkey;

-- Criar o utilizador na tabela users usando os dados do auth
INSERT INTO users (id, email, nome, tipo, auth_user_id)
VALUES (
  '2d62bcf5-cf46-40c2-a62c-f7d3bb767532',
  'izite95@gmail.com',
  'izite95@gmail.com',
  'comercial',
  '2d62bcf5-cf46-40c2-a62c-f7d3bb767532'
) ON CONFLICT (id) DO NOTHING;

-- Tornar autor_id nullable para evitar problemas futuros
ALTER TABLE contratos 
ALTER COLUMN autor_id DROP NOT NULL;

-- Recriar a foreign key mas permitindo NULL
ALTER TABLE contratos 
ADD CONSTRAINT contratos_autor_id_fkey 
FOREIGN KEY (autor_id) REFERENCES users(id);