-- Modificar as políticas RLS da tabela arquivos para permitir que todos vejam todos os arquivos

-- Remover a política de leitura restrita ao autor
DROP POLICY IF EXISTS "Ler arquivos do autor" ON public.arquivos;

-- Criar nova política para permitir que todos os utilizadores autenticados vejam todos os arquivos
CREATE POLICY "Ler todos os arquivos" 
ON public.arquivos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Modificar a política de inserção para definir automaticamente o autor
DROP POLICY IF EXISTS "Inserir arquivos" ON public.arquivos;

CREATE POLICY "Inserir arquivos" 
ON public.arquivos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND criado_por = auth.uid());