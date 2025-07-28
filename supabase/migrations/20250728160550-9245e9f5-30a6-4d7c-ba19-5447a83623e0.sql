-- Verificar e atualizar a tabela pedidos se necessário
-- A tabela já existe, mas vamos garantir que tem todos os campos necessários

-- Verificar se precisa adicionar campo data_criacao para compatibilidade
DO $$ 
BEGIN
    -- Adicionar campo data_criacao se não existir (para compatibilidade com interface)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pedidos' AND column_name = 'data_criacao') THEN
        ALTER TABLE pedidos ADD COLUMN data_criacao DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- Atualizar as políticas RLS se necessário
-- Política para permitir leitura por utilizadores autenticados
DROP POLICY IF EXISTS "Leitura por todos utilizadores autenticados" ON pedidos;
CREATE POLICY "Leitura por todos utilizadores autenticados" 
ON pedidos FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Política para permitir inserção com autor_id = auth.uid()
DROP POLICY IF EXISTS "Inserir pedidos com autor" ON pedidos;
CREATE POLICY "Inserir pedidos com autor" 
ON pedidos FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND autor_id = auth.uid());

-- Política para permitir atualização por autor
DROP POLICY IF EXISTS "Atualizar pedidos por autor" ON pedidos;
CREATE POLICY "Atualizar pedidos por autor" 
ON pedidos FOR UPDATE 
USING (autor_id = auth.uid());

-- Garantir que a tabela tem RLS habilitado
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;