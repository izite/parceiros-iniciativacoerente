-- Atualizar política RLS para permitir que todos os utilizadores vejam todos os contactos
DROP POLICY IF EXISTS "Leitura por autor" ON public.contactos;

-- Criar nova política que permite a todos os utilizadores autenticados verem todos os contactos
CREATE POLICY "Leitura por todos os utilizadores autenticados" 
ON public.contactos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Adicionar políticas para UPDATE e DELETE para utilizadores backoffice
CREATE POLICY "Atualizar contactos - Backoffice" 
ON public.contactos 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.role = 'backoffice'
));

CREATE POLICY "Apagar contactos - Backoffice" 
ON public.contactos 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.role = 'backoffice'
));