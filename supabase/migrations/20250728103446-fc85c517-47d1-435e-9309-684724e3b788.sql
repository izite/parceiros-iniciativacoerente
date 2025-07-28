-- Adicionar políticas para UPDATE e DELETE na tabela contactos
CREATE POLICY "Atualizar contactos - Utilizadores autenticados" 
ON public.contactos 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Apagar contactos - Utilizadores autenticados" 
ON public.contactos 
FOR DELETE 
USING (auth.uid() IS NOT NULL);