-- Fix remaining critical security issues

-- Fix users table exposure - restrict to authorized access only
DROP POLICY IF EXISTS "Backoffice/Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own row" ON public.users;

-- Only allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth_user_id = auth.uid() OR id = auth.uid());

-- Allow backoffice/admin to view all users
CREATE POLICY "Backoffice can view all users" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.auth_user_id = auth.uid() 
    AND u.role IN ('backoffice', 'admin')
  )
);

-- Fix contracts table exposure - remove public access
DROP POLICY IF EXISTS "Leitura por perfil atualizada" ON public.contratos;

-- Only allow contract owners and backoffice to view contracts
CREATE POLICY "Users can view their own contracts" 
ON public.contratos 
FOR SELECT 
USING (
  autor_id IN (
    SELECT id FROM public.users 
    WHERE auth_user_id = auth.uid()
  )
);

CREATE POLICY "Backoffice can view all contracts" 
ON public.contratos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('backoffice', 'admin')
  )
);

-- Fix pedidos table exposure - ensure proper access control
DROP POLICY IF EXISTS "Leitura por todos utilizadores autenticados" ON public.pedidos;

-- Ensure only request owners and authorized users can view requests
CREATE POLICY "Users can view their own requests enhanced" 
ON public.pedidos 
FOR SELECT 
USING (
  autor_id IN (
    SELECT id FROM public.users 
    WHERE auth_user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('backoffice', 'admin')
  )
);

-- Fix ocorrencias table access
CREATE POLICY "Backoffice can view all occurrences" 
ON public.ocorrencias 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('backoffice', 'admin')
  )
);

-- Update remaining functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_occurrence_number(occurrence_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'OC' || LPAD(numero_id::text, 3, '0')
  FROM public.ocorrencias
  WHERE id = occurrence_id;
$$;

CREATE OR REPLACE FUNCTION public.get_request_number(request_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'PD' || LPAD(numero_id::text, 3, '0')
  FROM public.pedidos
  WHERE id = request_id;
$$;

CREATE OR REPLACE FUNCTION public.get_contract_number(contract_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'CT' || LPAD(numero_id::text, 3, '0')
  FROM public.contratos
  WHERE id = contract_id;
$$;

CREATE OR REPLACE FUNCTION public.set_user_profile_by_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se o email for izite95@gmail.com, definir como administrador
  IF NEW.email = 'izite95@gmail.com' THEN
    NEW.tipo := 'administrador';
    NEW.role := 'admin';
    NEW.perfil := 'administrador';
  END IF;
  
  RETURN NEW;
END;
$$;