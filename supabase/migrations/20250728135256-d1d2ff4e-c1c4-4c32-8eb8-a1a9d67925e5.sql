-- Permitir inserção de utilizadores autenticados
CREATE POLICY "Permitir inserção de utilizadores" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir atualização de utilizadores por backoffice ou próprio utilizador
CREATE POLICY "Permitir atualização de utilizadores" 
ON public.users 
FOR UPDATE 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'backoffice'
  )
);

-- Permitir visualização de todos os utilizadores para utilizadores autenticados
DROP POLICY IF EXISTS "Ler dados do próprio utilizador" ON public.users;

CREATE POLICY "Visualizar todos os utilizadores" 
ON public.users 
FOR SELECT 
USING (auth.uid() IS NOT NULL);