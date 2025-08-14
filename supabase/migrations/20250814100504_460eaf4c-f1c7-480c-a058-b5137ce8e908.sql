-- Fix critical file access security issue
-- Remove the overly permissive policy that allows all authenticated users to view all files
DROP POLICY IF EXISTS "All authenticated users can view files" ON public.arquivos;
DROP POLICY IF EXISTS "Ler todos os arquivos" ON public.arquivos;

-- Create proper file access policy - users can only view their own files
CREATE POLICY "Users can view their own files" 
ON public.arquivos 
FOR SELECT 
USING (criado_por = auth.uid());

-- Allow backoffice users to view all files
CREATE POLICY "Backoffice can view all files" 
ON public.arquivos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.role = 'backoffice'
  )
);

-- Fix contact data exposure - restrict to backoffice only
DROP POLICY IF EXISTS "Leitura por todos os utilizadores autenticados" ON public.contactos;

CREATE POLICY "Only backoffice can view contacts" 
ON public.contactos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.role = 'backoffice'
  )
);

-- Allow users to view contacts they created
CREATE POLICY "Users can view contacts they created" 
ON public.contactos 
FOR SELECT 
USING (criado_por = auth.uid());

-- Fix function search path security issues
-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop trigger, function, and recreate with proper security
DROP TRIGGER IF EXISTS set_simulacao_numero ON public.simulacoes;
DROP FUNCTION IF EXISTS public.generate_simulacao_numero() CASCADE;

CREATE FUNCTION public.generate_simulacao_numero()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  formatted_number TEXT;
BEGIN
  -- Get the next sequence value
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero FROM '[0-9]+') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.simulacoes
  WHERE numero IS NOT NULL;
  
  -- Format as SIM-YYYY-NNNN
  formatted_number := 'SIM-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN formatted_number;
END;
$$;

-- Recreate the trigger
CREATE OR REPLACE FUNCTION public.set_simulacao_numero()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.numero IS NULL THEN
    NEW.numero := public.generate_simulacao_numero();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_simulacao_numero
  BEFORE INSERT ON public.simulacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_simulacao_numero();

-- Create security definer functions for RLS policies
CREATE OR REPLACE FUNCTION public.current_user_is_backoffice()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.role = 'backoffice'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.role IN ('backoffice', 'admin')
  );
$$;