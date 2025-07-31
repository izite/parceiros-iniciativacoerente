-- Criar políticas de storage para o bucket 'drive'
-- Política para permitir uploads
CREATE POLICY "Utilizadores autenticados podem carregar ficheiros" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'drive' AND 
    auth.uid() IS NOT NULL
);

-- Política para permitir visualização
CREATE POLICY "Utilizadores autenticados podem ver ficheiros" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'drive' AND 
    auth.uid() IS NOT NULL
);

-- Política para permitir atualização
CREATE POLICY "Utilizadores autenticados podem atualizar ficheiros" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'drive' AND 
    auth.uid() IS NOT NULL
);

-- Política para permitir eliminação
CREATE POLICY "Utilizadores autenticados podem eliminar ficheiros" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'drive' AND 
    auth.uid() IS NOT NULL
);